import org.jenkinsci.plugins.pipeline.modeldefinition.Utils

def gitLastCommonAncestor = ''

pipeline {
  agent { label 'master' }
  stages {
    stage('Prepare'){
      steps {
			bat 'echo BN0: %BUILD_NUMBER%'
        	bat 'echo The current directory is %CD%'
		  	bat 'dir'
		script {
			echo "Build number is ${currentBuild.number}"
			echo "BN1: %BUILD_NUMBER%"
			def buildNumber = currentBuild.number			
			echo "BN from script is "+buildNumber

			String BranchPrName = powershell (returnStdout:true, script: '''
				$p = $MyInvocation.MyCommand.Path
				$start = $p.LastIndexOf('_');
				$end = $p.IndexOf('@',$start+1);
				echo $p.substring($start+1, $end-$start-1)
				''')
			echo 'BranchPrName: '+BranchPrName
		
			String BN2 = powershell script:'''echo ${env:currentBuild.number}''', returnStdout:true
			echo 'BN2: '+BN2	

			String BN3 = powershell script:'''echo $env:BUILD_NUMBER''', returnStdout:true
			echo 'BN3: '+BN3			

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
