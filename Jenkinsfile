import org.jenkinsci.plugins.pipeline.modeldefinition.Utils

def gitLastCommonAncestor = ''
def buildNumberString = ''

pipeline {
  agent { label 'master' }
  stages {
    stage('Prepare'){
      steps {
		  	bat 'echo The current directory is %CD%'
		  	bat 'dir'
		script {
			buildNumberString = powershell (returnStdout:true, script: '''
				$p = $MyInvocation.MyCommand.Path
				$start = $p.LastIndexOf('_');
				$end = $p.IndexOf('@',$start+1);
				$folder = $p.substring($start+1, $end-$start-1)
				if( $folder -eq 'master')
				{
					$bn = $env:BUILD_NUMBER
				}else{
					$bn = $folder+'_run-'+$env:BUILD_NUMBER
				}
				echo $bn
				''')
			echo 'buildNumberString: '+buildNumberString

					dir("./Frontend") {
						bat 'echo The current directory is %CD%'

// 						groovy.json.JsonSlurper parser = new groovy.json.JsonSlurper()
// 						def json = readFile("./package.json")
// 						Map prop = parser.parseText(json)
// echo json
// echo prop

            def data = readFile(file: './package.json')
            echo "read from file: "+data

						def props = readJSON text: data, returnPojo: true
						echo "json from data: "+ props
            // echo "and again"
            // echo props
						def vvv = props.find { it.key == 'version' }
						echo 'version 1: '+vvv
						vvv.value = "0.1.${currentBuild.number}"
            echo 'version 2: '+vvv
						writeJson file: './package.json', json: props
					}

			String remotes = powershell script:'git remote', returnStdout:true
			echo 'Remotes: '+remotes				
			if( !remotes.contains('github') )
			{
				echo 'Adding github remote'
				powershell script:'git remote add github https://github.com/SeredaOM/AngularLearning.git'
				String res = powershell script:'git fetch github master'
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
				echo result;
				if (result) {
					echo 'FrontEnd result is true'
					bat 'npx --version'

					dir("./Frontend") {
						bat 'echo The current directory is %CD%'

						powershell script: 'npm ci'
						powershell script: 'npx ng build --prod'
						powershell script: 'npx ng test --sourceMap=false --browsers=ChromeHeadless --watch=false'
						powershell script: 'Get-ChildItem -Path C:\\Project\\Hosted\\hexes\\ -Include * -File -Recurse | foreach { $_.Delete()}'
						powershell script: 'Copy-Item -Path .\\dist\\angular-example\\* -Destination C:\\Project\\Hosted\\hexes\\ -recurse -Force'
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
	
  }
  
}
