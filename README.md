## INTRODUCTION 
This is a library used to manage queue jobs in the NestJS project. With it, you can manage your jobs intuitively and easily.

## HOW TO INTEGRATE?
### Install library
```
npm i yeolmae-job-management
```

### Create **`job.config.ts`**
```
import { Inject, Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';
import { InjectedQueues } from 'yeolmae-job-management';

@Injectable()
export class JobConfig {
  constructor(
    @Inject(InjectedQueues)
    private injectedQueues: { [key: string]: Queue },
    @InjectQueue('test') // Your queue name (Example: test) 
    private readonly testQueue: Queue,
  ) {
    this.injectedQueues['test'] = testQueue; // Your queue name (Example: test)
  }
}
```

### Create **`test-queue.processor.ts`**
This will contain all your code for processing the job of the `test` queue. It should be like this:
```
import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { JobConfig } from './config/job-config';
import { BaseProcessor } from 'yeolmae-job-management';

@Processor('test') // Your queue name (Example: test)
export class TestQueueProcessor extends BaseProcessor {
  constructor() {
    super();
  }

  @Process()
  async handle(job: Job) {
    try {
      await this.jobLogger.log(job.id, `TEST JOB ${job.id.toString()}`);
      // Your code
    } catch (e) {
      await this.jobLogger.log(job.id, e.stack);
    }
  }
}
``` 

### Add needed module and config to **`app.module.ts`**

At **`app.module.ts`**, add the following code to **`imports`** array of **`@Module`** decorator:
```
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
JobModule.forRoot({
    queueProcessorNames: ['test'], // name of your queue
})
```
**`JobModule`** and **`BullJobEntity`** should be imported like the following:
```
import { JobModule, BullJobEntity } from 'yeolmae-job-management';
``` 

Add **`JobConfig`** and **`TestQueueProcessor`** to **`providers`** array of **`@Module`** decorator:
```
providers: [... , JobConfig, TestQueueProcessor]
```

The **`app.module.ts`** should be like this:
```
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JobConfig } from './config/job-config';
import { TestQueue3Processor } from './test-queue3.processor';
import { BullJobEntity, JobModule } from 'yeolmae-job-management';


@Module({
  imports: [
    ... ,
    TypeOrmModule.forRoot({
      type: 'mariadb',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '123456',
      database: 'test-job-mng',
      entities: [BullJobEntity],
      synchronize: true,
    }),
    JobModule.forRoot({
      queueProcessorNames: ['test'],
    }),
  ],
  controllers: [..., AppController],
  providers: [..., AppService, JobConfig, TestQueueProcessor],
})
export class AppModule {}
```

### Add `JOB_MANAGEMENT_ROOT_PASS` to `.env`  
```
JOB_MANAGEMENT_ROOT_PASS=123456 // Enter the password to log in from UI (Example: 123456)
```

## HOW TO USE?
Run the project <br>
Access to this link: `https://vyphotphet100.github.io/yeolmae-job-management/index.html` <br>
Enter the `Hostname` and `Root password` <br>
Click `Connect` <br>

