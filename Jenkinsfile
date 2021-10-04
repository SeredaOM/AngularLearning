/* groovylint-disable CompileStatic, DuplicateStringLiteral, LineLength, MethodReturnTypeRequired, NestedBlockDepth, NestedForLoop, NoDef, VariableTypeRequired */
import org.jenkinsci.plugins.pipeline.modeldefinition.Utils
import com.cloudbees.groovy.cps.NonCPS

@NonCPS
def detectFirstNewCommit() {
  String commit
  boolean foundSuccessfulBuild = false

  def build = currentBuild
  while ( true ) {
    echo "build: id: ${build.id}, result: ${build.result}, changeSets: ${build.changeSets}"

    def changeSets =  build.changeSets
    if ( changeSets ) {
      echo "build.changeSets.size(): ${changeSets.size()}"
      def items = changeSets.last().items
      echo "changeSet.items.size(): ${items.size()}"
      commit = items.last().commitId
      echo "Current first unsuccessful commit: ${commit}"
    } else {
      echo 'build.changeSets is null'
    }

    echo 'over'
    echo "previousBuild: ${build.previousBuild}"
    build = build.previousBuild

    if ( build == null || build.result == 'SUCCESS' ) { break }
  }

  if ( build ) {
    foundSuccessfulBuild = build.result == 'SUCCESS'
  }
  echo "foundSuccessfulBuild: ${foundSuccessfulBuild}"

  return [foundSuccessfulBuild, commit]
}

def checkChanges(boolean hadSuccessfulBuild, String firstNewCommit, String folder) {
  if ( !hadSuccessfulBuild ) {
    return true
  }

  String result = powershell script:("git diff ${firstNewCommit}^ ${folder}"), returnStdout:true
  echo result

  return result != null
}

String firstNewCommit
boolean hadSuccessfulBuild = false
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
            (hadSuccessfulBuild, firstNewCommit) = detectFirstNewCommit()
            echo "commit: ${firstNewCommit}"
          } catch ( err ) {
            echo "Failed: ${err}"
          } finally {
            echo "Finally, commit: ${firstNewCommit}"
            if ( firstNewCommit == null ) {
              hadSuccessfulBuild = false
            }
          }
        }
      }
    }

    stage('Build') {
      parallel {
        stage('Build Frontend') {
          steps {
            script {
              builtFrontend = checkChanges(hadSuccessfulBuild, firstNewCommit, 'Frontend/')
              if ( builtFrontend ) {
                dir('./Frontend') {
                  echo 'Building Frontend'
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
                }
              } else {
                echo 'FrontEnd is not built'
                Utils.markStageSkippedForConditional(env.STAGE_NAME)
                echo 'echo FrontEnd after markStageSkippedForConditional'
              }
            }
          }
        }
        stage('Build WebAPI') {
          steps {
            script {
              builtWebApi = checkChanges(hadSuccessfulBuild, firstNewCommit, 'WebAPI/')
              if ( builtWebApi ) {
                dir('./WebAPI') {
                  echo 'Building WebAPI'

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
                }
              } else {
                echo 'WebAPI is not built'
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
  post {
      always {
        echo 'post always'
      }
      failure {
        echo 'post failure'
      }
  }
}
