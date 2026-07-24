---
title: "How to Handle DynamoDB Streams the Easy Way in Typescript"
date: "2024-03-24"
description: "How Dynamode v1.0.0's new Stream class makes handling DynamoDB stream records in TypeScript Lambda functions simple and readable."
canonical: "https://medium.com/swmansion/how-to-handle-dynamodb-streams-the-easy-way-in-typescript-ff870f370310"
---

If you’re someone who regularly works with AWS and DynamoDB, you may well be familiar with the challenges associated with handling DynamoDB Streams. They are incredibly useful, but managing and processing their records can often prove complex.

However, times have changed. The just-launched **Dynamode v1.0.0** is here to change the game.

![Dynamode v1.0.0 just launched!](https://cdn-images-1.medium.com/max/1024/1*3jpMkRRSmdhj_-DoBVBXGw.png)

## Introducing Dynamode v1.0.0

I’m excited to announce that Dynamode is finally out of beta! One of the most exciting changes in this version is the introduction of a new Stream class that makes handling DynamoDB streams easier than ever before.

**Leave Dynamode a star on** [**Github**](https://github.com/blazejkustra/dynamode) **⭐️**

### How does it work?

Consider a Node.js AWS Lambda function triggered by a DynamoDB stream event. In the new setup, you’d create an instance of the Stream class for each record in the stream. Then, you’d call the Stream.isEntity(entity) method to verify if the created stream instance corresponds to your entity (more info on how to model your entities [here](https://medium.com/swmansion/modeling-with-dynamodb-made-easy-in-typescript-cdada092d387)), add your custom logic, and voila!

```typescript
import type { Context, DynamoDBStreamEvent } from 'aws-lambda';
import Stream from 'dynamode/stream';

function itemStream(event: DynamoDBStreamEvent, context: Context): void {
  event.Records.map((record) => new Stream(record)).forEach(async (stream) => {
    // Update list progress when an item is created
    if (stream.isEntity(Item)) {
      if (stream.operation === 'insert' && stream.newImage) {
        await ListManager.update(List.getPrimaryKey(stream.newImage.listId), {
          increment: {
            'progress.checked': 1,
          },
        });
      }
    }
  }
}
```

In this example, the Stream class deals with all the complexities of the underlying DynamoDB record, leaving the itemStream function to follow a clear and readable logic. We check if the item was created, then we perform the required update on the list.

Before, this would require manually decoding the DynamoDB record and handling various conditions. Now, it is as simple as asking “is this an `Item` instance?” with stream.isEntity(Item).

### Wrapping Up

Dynamode v1.0.0 continues the attempt to make working with DynamoDB in Node.js as effortless and intuitive as possible. With the addition of the new Stream class, Dynamode proved that it’s ready for production apps.

For more information on streams, **Check out the** [**documentation**](https://blazejkustra.github.io/dynamode/)! **📘**
