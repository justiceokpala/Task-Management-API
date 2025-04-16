import { DataSource } from "typeorm"
import Task  from "./src/entity/task.entity"
import User from "./src/entity/user"

const AppDataSource = new DataSource({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'perFECT7*',
    database: 'TaskmanDb',
    synchronize: true, // set to false in production
    logging: false,
    entities: [Task, User], 
})

export default AppDataSource



