import org.jenkinsci.plugins.pipeline.modeldefinition.Utils

def gitLastCommonAncestor = ''
def branchFolder = ''
def buildNumberString = ''
def builtFrontend = false

pipeline {
  agent { label 'master' }
  stages {
    stage('Prepare') {
      steps {
        bat 'echo The current directory is %CD%'
        bat 'dir'
		    script {
          branchFolder = powershell (returnStdout:true, script: '''
            $p = $MyInvocation.MyCommand.Path
            $start = $p.LastIndexOf('_');
            $end = $p.IndexOf('@',$start+1);
            $folder = $p.substring($start+1, $end-$start-1)
            echo $folder
            ''')
          branchFolder = branchFolder.substring(0,folder.length()-2)
          echo branchFolder
          if( branchFolder != 'master' )
          {
            echo 111
            buildNumberString = branchFolder + '_run-'
          }
          echo '1: '+buildNumberString
          buildNumberString += ${BUILD_NUMBER}
          echo 'buildNumberString: '+buildNumberString

          String remotes = powershell script:'git remote', returnStdout:true
          echo 'Remotes: '+remotes				
          if( !remotes.contains('github') )
          {
            echo 'Adding github remote'
            powershell script:'git remote add github https://github.com/SeredaOM/AngularLearning.git'
            powershell script:'git fetch github master'
          }
              
          //	This command helped to spot the remote branches in the history
          //	echo powershell script:'git log --graph --decorate --oneline', returnStdout:true
              
          String gitMasterBranchLastCommitHash = powershell script:'git rev-parse github/master', returnStdout:true
          echo 'MasterBranchLatestCommitHash: '+gitMasterBranchLastCommitHash

          gitLatestCommonAncestor = powershell script:'git merge-base HEAD github/master', returnStdout:true
          gitLatestCommonAncestor = gitLatestCommonAncestor.substring(0,gitLatestCommonAncestor.length()-2)
          echo 'LatestCommonAncestor: "'+gitLatestCommonAncestor+'".'
        }
      }
    }

    stage('Build') {
      parallel {
        stage('Build Frontend') {
          steps {
			script {

				String result = powershell script:('git diff '+gitLatestCommonAncestor+' HEAD Frontend/'), returnStdout:true
				echo result
				if (result) {
					dir("./Frontend") {
						bat 'echo The current directory is %CD%'

            def packageFilePath = './package.json'
            def props = readJSON file: packageFilePath, returnPojo: true
            props['version'] = new String(props['version'].value) + buildNumberString
            echo "updated props: " + props
            writeJSON file: packageFilePath, json: props

            def props2 = readJSON(file: packageFilePath)
            echo "json from data 2: " + props2
            
						powershell script: 'npm ci'
						powershell script: 'npx ng build --prod'
						powershell script: 'npx ng test --sourceMap=false --browsers=ChromeHeadless --watch=false'
            builtFrontend = true
					}
				} else {
					echo 'FrontEnd result is false'
					Utils.markStageSkippedForConditional(env.STAGE_NAME)
					echo 'echo FrontEnd after markStageSkippedForConditional'					
				}
			}
          }		  
        }
        stage('Build WebAPI') {
          steps {
			script {
				String result = powershell script:('git diff '+gitLatestCommonAncestor+' HEAD WebAPI/'), returnStdout:true
				echo result;
				if (result) {
					echo 'WebAPI result is true'
					bat 'echo compile .NET project'
				} else {
					echo 'WebAPI result is false'
					Utils.markStageSkippedForConditional(env.STAGE_NAME)
					echo 'echo WebAPI after markStageSkippedForConditional'
				}
			}
          }
        }
      }
    }

    stage('Deploy')	{
      steps {
        script {
          if( branchFolder == 'master' ) {
            if(builtFrontend) {
              powershell script: 'Get-ChildItem -Path C:\\Project\\Hosted\\hexes\\ -Include * -File -Recurse | foreach { $_.Delete()}'
              powershell script: 'Copy-Item -Path .\\FrontEnd\\dist\\angular-example\\* -Destination C:\\Project\\Hosted\\hexes\\ -recurse -Force'
              powershell script: 'Copy-Item -Path .\\FrontEnd\\web.config -Destination C:\\Project\\Hosted\\hexes\\ -Force'
            }
          }
        }
      }
    }
  }
  
}
