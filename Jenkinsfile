pipeline {
    agent any
    environment {
        CI = "true"  
        VAULT_SECRET = vault path: 'secret/jenkins/testkey', engineVersion: "2", key: 'value'
    }
    stages {
        stage('Checkout') {
            steps {
                sh ' rm -rf mywork' // Ensure it's clean
                checkout scm       // Clone the repo in the root directory
                sh 'mkdir mywork && mv * mywork/ 2>/dev/null || true' // Move everything to mywork
                }
        }
       stage('Install Dependencies') { 
            steps {
                echo 'installing dependencies...' 
                sh '''
                    cd mywork
                    #npm install
                '''
                 
            }
        }
        stage('Set up environment') { 
            steps {
                 echo 'setting up environment variables...'   
                 echo "this is a test secret wow: ${env.VAULT_SECRET}"
            }
        }
        stage('Lint Code') { 
            steps {
                 echo 'Linting...'   
                 sh '''
                    cd mywork
                    #npm run lint
                 '''
            }
        }
        stage('Test') { 
            steps {
                 echo 'test...'  
                 sh '''
                    cd mywork
                    #npx vitest
                 '''
            }
        }
        stage('Build') { 
            steps {
                 echo 'building...'  
                sh '''
                    cd mywork
                    #npm run build
                    cd ..
                    #rm -rf mywork
                 '''
            }
        }
    }
    post {
        success {
            script {
                 githubNotify context: 'Pipeline Wizard Speaking',
                         description: 'Build successful, good job :)',
                         status: 'SUCCESS',
                         repo: 'Front_End',
                         credentialsId: 'notify-token',
                         account: 'LinkUp-SW',
                         sha: env.GIT_COMMIT
            }
        }
        failure {
            script {
                githubNotify context: 'Pipeline Wizard Speaking',
                         description: 'Build failed, rage3 nafsak :(',
                         status: 'FAILURE',
                         repo: 'Front_End',
                         credentialsId: 'notify-token',
                         account: 'LinkUp-SW',
                         sha: env.GIT_COMMIT
            }
        }
    }

}
