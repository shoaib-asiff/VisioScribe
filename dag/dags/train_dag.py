import boto3
from datetime import datetime, timedelta
from airflow import DAG
from airflow.providers.amazon.aws.operators.ecs import EcsRunTaskOperator
from airflow.operators.python import PythonOperator # <--- Changed import

AWS_REGION = "eu-north-1"
CLUSTER_NAME = "visioscribe-cluster"
TRAINER_TASK_DEF = "visioscribe-trainer-task:1"
MODEL_SERVICE = "visioscribe-model-service-1"

SUBNETS = ["subnet-05c26288cc8d0a6c3"]    
SECURITY_GROUPS = ["sg-0edb672f3f5a86806"]

default_args = {
    'owner': 'airflow',
    'start_date': datetime(2023, 1, 1),
    'retries': 0,
}

# --- NEW FUNCTION TO UPDATE SERVICE ---
def force_service_update():
    client = boto3.client('ecs', region_name=AWS_REGION)
    response = client.update_service(
        cluster=CLUSTER_NAME,
        service=MODEL_SERVICE,
        forceNewDeployment=True
    )
    print(f"Update Service Triggered: {response}")

with DAG(
    dag_id='train_and_deploy_pipeline',
    default_args=default_args,
    schedule_interval=timedelta(days=1), 
    catchup=False,
) as dag:

    # 1. Train Model (This part was perfect)
    train_model = EcsRunTaskOperator(
        task_id='train_new_model',
        cluster=CLUSTER_NAME,
        task_definition=TRAINER_TASK_DEF,
        launch_type='FARGATE',
        network_configuration={
            "awsvpcConfiguration": {
                "subnets": SUBNETS,
                "securityGroups": SECURITY_GROUPS,
                "assignPublicIp": "ENABLED"
            }
        },
        overrides={},
        aws_conn_id='aws_default',
        region_name=AWS_REGION,
        wait_for_completion=True,
    )

    # 2. Deploy Model (Using Python instead of Bash)
    # This works because 'boto3' is already installed in your image
    deploy_model = PythonOperator(
        task_id='deploy_backend',
        python_callable=force_service_update
    )

    train_model >> deploy_model