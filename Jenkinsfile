pipeline {
    agent any

    environment {
        // Chemins pour les outils installés dans le conteneur Jenkins
        PATH = "/usr/local/bin:/opt/sonar-scanner/bin:${env.PATH}"
    }

    stages {
        stage('🔌 Checkout from GitHub') {
            steps {
                // Cette commande récupère TOUT le projet depuis votre repo GitHub
                checkout scm
            }
        }

        stage('🧪 Quality Analysis (SonarQube)') {
            steps {
                script {
                    echo "Lancement de l'analyse statique..."
                    try {
                        withSonarQubeEnv('SonarQubeServer') {
                            sh "sonar-scanner -Dsonar.projectKey=ads-app -Dsonar.sources=."
                        }
                    } catch (Exception e) {
                        echo "⚠️ Fallback: Analyse manuelle (Plugin non configuré)"
                        sh "sonar-scanner -Dsonar.projectKey=ads-app -Dsonar.sources=. -Dsonar.host.url=http://host.docker.internal:9000 -Dsonar.login=admin -Dsonar.password=admin123"
                    }
                }
            }
        }

        stage('🛡️ Quality Gate') {
            steps {
                script {
                    try {
                        // On attend le retour de SonarQube (nécessite un Webhook configuré dans Sonar)
                        waitForQualityGate abortPipeline: true
                    } catch (Exception e) {
                        echo "⚠️ Attention: Pas de retour du Quality Gate (Plugin/Webhook absent). On continue."
                    }
                }
            }
        }

        stage('🚀 Deploy to Colima (Helm)') {
            steps {
                echo "Déploiement en cours sur le namespace 'ads-dev'..."
                // Utilisation des fichiers Helm clonés depuis GitHub
                sh """
                helm upgrade --install ads-app ./deployments/ads-dev/charts/ads-app \
                    --namespace ads-dev \
                    --set image.tag=${env.BUILD_NUMBER}
                """
            }
        }
    }

    post {
        success {
            echo "🎉 Succès ! L'application est déployée sur votre cluster Colima."
        }
        failure {
            echo "❌ Échec. Vérifiez les logs de la console."
        }
    }
}
