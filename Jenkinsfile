import org.jenkinsci.plugins.pipeline.modeldefinition.Utils

def gitLastCommonAncestor = ''

pipeline {
  agent { label 'master' }
  stages {
    stage('Prepare'){
      steps {
        bat 'echo The current directory is %CD%'
        bat 'dir'
		script {
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
				echo result;
				if (result) {
					echo 'FrontEnd result is true'
					bat 'npx --version'

					powershell script:'cd Frontend'
					powershell script:'npx ng build'
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
