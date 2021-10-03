/* groovylint-disable CompileStatic, DuplicateStringLiteral, LineLength, NestedBlockDepth, NestedForLoop */
import org.jenkinsci.plugins.pipeline.modeldefinition.Utils

String gitLatestCommonAncestor
boolean builtFrontend = false
boolean builtWebApi = false

pipeline {
  agent { label 'master' }
  stages {
    stage('Prepare') {
      steps {
        bat 'echo The current directory is %CD%'
        bat 'dir'
        script {
          build = currentBuild

          while ( build.previousBuild ) {
            echo 'build.id: ' + build.id + ', result: ' + build.result
            if ( build.changeSets ) {
              echo 'changeSets: ' + build.changeSets
              /* groovylint-disable-next-line NestedForLoop */
              for (changeLog in build.changeSets) {
                echo '  changeLog: ' + changeLog
                for (entry in changeLog.items) {
                  echo '    entry: ' + entry
                  for (file in entry.affectedFiles) {
                    echo "      file: * ${file.path}\n"
                  }
                }
              }
            } else {
              echo 'no changeSets'
            }

            echo 'build.previousBuild: ' + build.previousBuild
          }

          String remotes = powershell script:'git remote', returnStdout:true
          echo 'Remotes: ' + remotes
          if ( !remotes.contains('github') ) {
            echo 'Adding github remote'
            powershell script:'git remote add github https://github.com/SeredaOM/AngularLearning.git'
            powershell script:'git fetch github master'
          }

          //    This command helped to spot the remote branches in the history
          //    echo powershell script:'git log --graph --decorate --oneline', returnStdout:true

          String gitMasterBranchLastCommitHash = powershell script:'git rev-parse github/master', returnStdout:true
          echo 'MasterBranchLatestCommitHash: ' + gitMasterBranchLastCommitHash

          gitLatestCommonAncestor = powershell script:'git merge-base HEAD github/master', returnStdout:true
          gitLatestCommonAncestor = gitLatestCommonAncestor[0..<-2]
          echo 'LatestCommonAncestor: "' + gitLatestCommonAncestor + '".'
        }
      }
    }

    stage('Build') {
      parallel {
        stage('Build Frontend') {
          steps {
            script {
              String result = powershell script:('git diff ' + gitLatestCommonAncestor + ' HEAD Frontend/'), returnStdout:true
              echo result
              if (result) {
                dir('./Frontend') {
                  // if( branchFolder == 'master' ) {
                  //   def packageFilePath = './package.json'
                  //   def props = readJSON file: packageFilePath, returnPojo: true
                  //   def version = new String(props['version'].value)
                  //   def versionCut = version.substring(0, version.lastIndexOf('.')+1)
                  //   props['version'] = versionCut + buildNumberString
                  //   echo "updated props: " + props
                  //   writeJSON file: packageFilePath, json: props

                  //   def props2 = readJSON(file: packageFilePath)
                  //   echo "json from data 2: " + props2
                  // }
                  powershell \
                    label: 'Updating version patch with the build number',
                    script: """
                      [string] \$version = \$(node -p "require('./package.json').version") -replace '\\d+\$', '${currentBuild.number}'
                      npm --no-git-tag-version version \$version
                    """
                  String env = env.CHANGE_ID == null ? 'stage' : 'dev'

                  powershell script: 'npm ci'
                  powershell script: 'npx ng build --configuration ' + env
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
              String result = powershell script:('git diff ' + gitLatestCommonAncestor + ' HEAD WebAPI/'), returnStdout:true
              echo result
              if (result) {
                dir('./WebAPI') {
                  echo 'WebAPI result is true'

                  // if( branchFolder == 'master' ) {
                  //   echo 'Replacing version'
                  //   powershell script:('''(Get-Content ./Properties/AssemblyInfo.cs) -replace '(Assembly[File]*Version\\("[\\d+]+.[\\d+]+).([\\d+]+).0', '$1.''' + buildNumberString + '''.0' | Set-Content ./Properties/AssemblyInfo.cs''')
                  //   echo 'Replaced 3rd number in the version'
                  //   powershell script:('Get-Content ./Properties/AssemblyInfo.cs')
                  // }

                  // echo 'Building WebApi...'
                  // powershell script:('dotnet build --configuration Release')
                  powershell \
                    label: 'Compile .NET project',
                    script: "dotnet build WebAPI.sln --configuration Release -property:BuildNumber=${currentBuild.number}"

                  builtWebApi = true
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

    stage('Deploy')    {
      steps {
        script {
          String deploymentRootFolder = 'C:\\Project\\Hosted\\'
          if ( env.CHANGE_ID == null ) {
            // master, deploy to STAGE
            deploymentRootFolder += 'STAGE'
          } else {
            // PR, deploy to DEV
            deploymentRootFolder += 'DEV'
          }
          echo 'Deploying to ' + deploymentRootFolder

          if (builtFrontend) {
            echo 'Deploying Frontend'
            frontendDeploymentRootFolder = deploymentRootFolder + '\\hexes\\'
            powershell script: 'Get-ChildItem -Path ' + frontendDeploymentRootFolder + ' -Include * -File -Recurse | foreach { $_.Delete()}'
            powershell script: 'Copy-Item -Path .\\FrontEnd\\dist\\angular-example\\browser\\* -Destination ' + frontendDeploymentRootFolder + ' -recurse -Force'
            powershell script: 'Copy-Item -Path .\\FrontEnd\\web.config -Destination ' + frontendDeploymentRootFolder + ' -Force'
            echo 'Completed Frontend deployment'
          }
          if (builtWebApi) {
            dir('./WebAPI') {
              webpapiDeploymentRootFolder = deploymentRootFolder + '\\WebApiBuild\\'
              powershell \
                      label: 'Publishing WebApi',
                      script: '''
                        $path = "''' + webpapiDeploymentRootFolder + '''"
                        $fp = "App_Offline.htm"
                        Get-ChildItem -Exclude Logs | Get-ChildItem -Path $path -Include * -File -Recurse | foreach { $_.Delete()}
                        if( !( Test-Path $path$fp ) ) {
                          New-Item -Path $path -Name $fp -ItemType "file" -Value "Shutting down..."
                          echo "Created App_Offline.htm"
                        }
                        $failures = 0;
                        [bool] $finish = $false
                        Do {
                          dotnet publish --output $path --configuration Release --no-build
                          if( $? ) {
                            echo "Published successfully"
                            Remove-Item -Path $path$fp
                            echo "Removed App_Offline.htm"
                            $finish = $true
                          } else {
                            echo "Error publishing"
                            if( $failures -le 5 ) {
                              $failures++
                              $sl = 10*$failures
                              echo "Sleeping for $sl seconds..."
                              Start-Sleep -s $sl
                              echo "Publish again, failures: $failures"
                            } else {
                              echo "Feiled to publish after $failures attempts"
                              $finish = $true
                            }
                          }
                        } Until ( $finish )
                      '''
              echo 'Completed WebApi publishing'
            }
          }
        }
      }
    }
  }
}
