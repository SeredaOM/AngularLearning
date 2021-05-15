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

def props = readJSON text: '''{
  "name": "angular-example",
  "version": "0.1.1",
  "scripts": {
    "ng": "ng",
    "start": "ng serve",
    "build": "ng build",
    "test": "ng test",
    "lint": "ng lint",
    "e2e": "ng e2e",
    "generate": "node ./server/generate.js > ./server/database.json",
    "server": "json-server --watch ./server/database.json"
  },
  "private": true,
  "dependencies": {
    "@angular/animations": "~10.0.11",
    "@angular/cdk": "^10.1.3",
    "@angular/common": "~10.0.11",
    "@angular/compiler": "~10.0.11",
    "@angular/core": "~10.0.11",
    "@angular/fire": "^6.0.2",
    "@angular/forms": "~10.0.11",
    "@angular/material": "^10.1.3",
    "@angular/platform-browser": "~10.0.11",
    "@angular/platform-browser-dynamic": "~10.0.11",
    "@angular/router": "~10.0.11",
    "@types/offscreencanvas": "^2019.6.2",
    "faker": "^4.1.0",
    "firebase": "^7.13.1",
    "json-server": "^0.16.1",
    "ngx-cookie-service": "^10.0.1",
    "rxjs": "~6.5.5",
    "tslib": "^2.0.0",
    "zone.js": "~0.10.3"
  },
  "devDependencies": {
    "@angular-devkit/architect": ">= 0.900 < 0.1100",
    "@angular-devkit/build-angular": "~0.1000.7",
    "@angular/cli": "^10.0.8",
    "@angular/compiler-cli": "~10.0.11",
    "@types/jasmine": "~3.5.0",
    "@types/jasminewd2": "~2.0.3",
    "@types/node": "^12.11.1",
    "codelyzer": "^6.0.0",
    "firebase-tools": "^8.0.0",
    "fuzzy": "^0.1.3",
    "inquirer": "^6.2.2",
    "inquirer-autocomplete-prompt": "^1.0.1",
    "jasmine-core": "~3.5.0",
    "jasmine-spec-reporter": "~5.0.0",
    "karma": "~5.0.0",
    "karma-chrome-launcher": "~3.1.0",
    "karma-coverage-istanbul-reporter": "~3.0.2",
    "karma-jasmine": "~3.3.0",
    "karma-jasmine-html-reporter": "^1.5.0",
    "open": "^7.0.3",
    "protractor": "~7.0.0",
    "ts-node": "~8.3.0",
    "tslint": "~6.1.0",
    "typescript": "~3.9.5"
  }
}'''
echo 'prop kscriptsey:'+ props['devDependencies']

// 						groovy.json.JsonSlurper parser = new groovy.json.JsonSlurper()
// 						def json = readFile("./package.json")
// 						Map prop = parser.parseText(json)
// echo json
// echo prop

            def data = readFile(file: './package.json')
            echo "read from file: "+data

						def props2 = readJSON text: data, returnPojo: true
						echo "json from data: "+ props2
						//def vvv = props.find { it.name == 'version' }
						//echo vvv
						//vvv.value = "0.1.${currentBuild.number}"
						//writeJson file: './package.json', json: props
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
