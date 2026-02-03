pipeline {
    agent any

    parameters {
        string(name: 'VERSION', defaultValue: '1.0.0-SNAPSHOT', description: 'Version de la release ou snapshot')
        choice(name: 'ENVIRONMENT', choices: ['dev', 'prod'], description: 'Environnement de déploiement')
        booleanParam(name: 'ONLY_BUILD', defaultValue: false, description: 'Si coché, effectue uniquement le build et l\'analyse Sonar (pas de déploiement)')
    }

    environment {
        PATH = "/usr/local/bin:/opt/sonar-scanner/bin:${env.PATH}"
    }

    stages {
        stage('🔌 Checkout Project') {
            steps {
                checkout scm
            }
        }

        stage('🧪 Quality Analysis (SonarQube)') {
            steps {
                script {
                    def projectKey = env.JOB_NAME.split('/')[0].toLowerCase()
                    sh "sonar-scanner -Dsonar.projectKey=${projectKey}-build -Dsonar.sources=. -Dsonar.host.url=http://sonarqube:9000 -Dsonar.login=admin -Dsonar.password=admin123 -Dsonar.exclusions=**/*.java"
                }
            }
        }

        stage('🛠️ Build') {
            steps {
                echo "Simulation du build pour la version: ${params.VERSION}"
                sh "sleep 2"
            }
        }

        stage('🚀 Deploy to Colima (Helm)') {
            when {
                expression { params.ONLY_BUILD == false }
            }
            steps {
                echo "Récupération des configurations Helm (Monorepo)..."
                dir('helm') {
                    checkout([$class: 'GitSCM', branches: [[name: '*/main']], userRemoteConfigs: [[credentialsId: 'github-pat', url: 'https://github.com/Ads10045/helm']]])
                }
                
                script {
                    def appName = env.JOB_NAME.split('/')[0].toLowerCase()
                    sh """
                        helm upgrade --install ${appName} ./helm/helm-main/${appName} \
                        --namespace ${appName} --create-namespace \
                        --set image.tag=latest \
                        -f ./helm/helm-dev/${appName}/application-variable.properties \
                        -f ./helm/helm-secret/${appName}/${appName}.secret
                    """
                }
            }
        }
    }

    post {
        success {
            echo "✅ Processus terminé avec succès pour ${params.VERSION}"
        }
    }
}
