pipeline {
    agent any

    stages {

        stage('Clone') {
            steps {
                git branch: 'main', url: 'https://github.com/GoswamiAasvi/Netflix-clone.git'
            }
        }

        stage('Add API') {
            steps {
                sh '''
                echo "VITE_APP_TMDB_V3_API_KEY=16161e8b7725597daa1211538c1860eb" > .env
                '''
            }
        }

        stage('Install') {
            steps {
                sh 'npm install'
            }
        }

        stage('Security Scan') {
            steps {
                sh 'trivy fs . > trivy.txt || true'
            }
        }

        stage('Build Image') {
            steps {
                sh '''
                docker build -t netflix \
                --build-arg TMDB_V3_API_KEY=16161e8b7725597daa1211538c1860eb .
                '''
            }
        }

        stage('Deploy Container') {
            steps {
                sh '''
                docker rm -f netflix || true
                docker run -d -p 8081:80 --name netflix_clone netflix
                '''
            }
        }
    }
}