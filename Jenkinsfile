import org.jenkinsci.plugins.pipeline.modeldefinition.Utils

def gitLastCommonAncestor = ''
def builtFrontend = false
def builtWebApi = false

pipeline {
  agent { label 'master' }
  stages {
    stage('Prepare') {
      steps {
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
				echo result
				if (result) {
					dir("./Frontend") {
						bat 'echo The current directory is %CD%'

						if (env.CHANGE_ID == null) {
							powershell \
								label: 'Updating version patch with the build number',
								script: """
									[string] \$version = \$(node -p "require('./package.json').version") -replace '\\d+\$', '${currentBuild.number}'
									npm --no-git-tag-version version \$version
								"""
						}

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
                dir("./WebAPI") {
                  echo 'WebAPI result is true'

                  powershell \
                    label: 'Compile .NET project',
                    script: "dotnet build WebAPI.sln --configuration Release -property:BuildNumber=${env.CHANGE_ID == null ? currentBuild.number : 0}"

                  builtWebApi = true;
                }
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
          if( env.CHANGE_ID == null ) {
            if(builtFrontend) {
              echo 'Deploying Frontend'
              powershell script: 'Get-ChildItem -Path C:\\Project\\Hosted\\hexes\\ -Include * -File -Recurse | foreach { $_.Delete()}'
              powershell script: 'Copy-Item -Path .\\FrontEnd\\dist\\angular-example\\browser\\* -Destination C:\\Project\\Hosted\\hexes\\ -recurse -Force'
              powershell script: 'Copy-Item -Path .\\FrontEnd\\web.config -Destination C:\\Project\\Hosted\\hexes\\ -Force'
              echo 'Completed Frontend deployment'
            }
          }
          //if( env.CHANGE_ID == null ) {
            if(builtWebApi) {
              echo 'Deploying WebApi'
              powershell script: 'Get-ChildItem -Path C:\\Project\\Hosted\\WebApiBuild\\ -Include * -File -Recurse | foreach { $_.Delete()}'
              powershell script: 'Copy-Item -Path .\\WebAPI\\bin\\Release\\net5.0\\* -Destination C:\\Project\\Hosted\\WebApiBuild\\ -recurse -Force'
              echo 'Completed WebApi deployment'
            }
          //}
        }
      }
    }
  }
  
}
