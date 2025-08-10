could you make a post get and delete api route for my Note model

schema.prisma

```prisma
model User {
  userId      Int     @id @default(autoincrement())
  username    String  @unique
  password    String

  notes    Note[]  @relation("UserNotes")
}

model Note {
  noteId  Int    @id @default(autoincrement())
  note    String
  isDone  Boolean @default(true)
  userId  Int

  user    User   @relation(fields: [userId], references: [userId], name: "UserNotes")
}
```
