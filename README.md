## INTRODUCTION 
This is a library used to manage queue jobs in the NestJS project. With it you can manage your jobs intuitively and easily.

## HOW TO USED
At app.module.ts, add the following code to imports array of @Module decorator:
TypeOrmModule.forRoot({
    type: 'mariadb',               // type of your database
    host: 'localhost',             // db host 
    port: 3306,                    // db port 
    username: 'root',              // username to access your db 
    password: '123456',            // password to access your db 
    database: 'test-db',           // db name
    entities: [BullJobEntity],     // this entity is imported from this library
    synchronize: true,
}),