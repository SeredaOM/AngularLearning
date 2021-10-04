/* groovylint-disable CompileStatic, DuplicateStringLiteral, LineLength, MethodReturnTypeRequired, NestedBlockDepth, NestedForLoop, NoDef */
import org.jenkinsci.plugins.pipeline.modeldefinition.Utils

@NonCPS
def firstCommitSinceSuccessfulBuild() {
  String commit

  build = currentBuild
  echo "previousBuild: ${build.previousBuild}, result: ${build.result}"
  while ( build.previousBuild && build.result != 'SUCCESS' ) {
    echo "build: id: ${build.id}, result: ${build.result}, changeSets: ${build.changeSets}"

    changeSets =  build.changeSets
      // def log
      // if ( build.result == 'SUCCESS')
      // {
      //   log = changeSets[0]
      // } else {
      //   log = changeLog.last
      // }
      // for (changeLog in build.changeSets) {
      //   echo "  changeLog.length: ${changeLog.length}"
    if ( changeSets ) {
      echo "build.changeSets.size(): ${changeSets.size()}"
      for (changeSet in changeSets) {
        items = changeSet.items
        echo "  changeSet.items.size(): ${items.size()}"
        for (entry in items) {
          echo "      commit: ${entry.commitId}}"
          commit = entry.commitId
          // for (file in entry.affectedFiles) {
          //   echo "      file: * ${file.path}, ${entry.msg} by ${entry.author}\n"
          // }
        }
      }
    } else {
      echo 'build.changeSets is null'
    }

    echo 'over'

    build = build.previousBuild
  }

  return commit
}

String firstNewCommit
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
          try {
            firstNewCommit = firstCommitSinceSuccessfulBuild()
            echo "commit: ${firstNewCommit}"
          } catch ( err ) {
            echo "Failed: ${err}"
          } finally {
            echo "Finally, commit: ${firstNewCommit}"
          }
        }
      }
    }

    stage('Build') {
      parallel {
        stage('Build Frontend') {
          steps {
            script {
              String result = powershell script:('git diff ' + firstNewCommit + ' HEAD Frontend/'), returnStdout:true
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
              String result = powershell script:('git diff ' + firstNewCommit + ' HEAD WebAPI/'), returnStdout:true
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
