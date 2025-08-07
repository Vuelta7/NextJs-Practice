i dont really understand everything that u said but i manage to do this:

```bash
✔ Network todo-practice_default         Created                                                                                                                0.0s
 ✔ Volume "todo-practice_postgres_data"  Created                                                                                                                0.0s
 ✔ Container todo-practice-postgres-1    Started                                                                                                                4.6s

uriel@Ultron MINGW64 ~/Tailwind-Practice/todo-practice (main)
$ npx prisma db push
Environment variables loaded from .env
Prisma schema loaded from prisma\schema.prisma
Datasource "db": PostgreSQL database "mydb", schema "public" at "localhost:5432"

Your database is now in sync with your Prisma schema. Done in 138ms

✔ Generated Prisma Client (v6.13.0) to .\src\generated\prisma in 257ms
```

Now how do I implement register in my "src/app/auth/register/page.tsx" that all I want to know my register/page.tsx currently look like this:

```tsx
"use client";
import Circle from "../../components/bgCircle";
import { useRouter } from "next/navigation";

export default function Register() {
  const router = useRouter();

  function registerAccount() {
    // this is where I want to do the functionality to put it in the database

    router.push("/home");
  }

  return (
    <div className="min-h-screen bg-gray-100 relative flex flex-col overflow-hidden">
      {/* Background circles */}
      <Circle />

      {/* Main content */}
      <div className="flex-1 flex flex-col px-8 pt-60">
        {/* Header text */}
        <div className="text-center mb-12">
          <h1 className="text-2xl font-bold text-black mb-4">
            Welcome to Onboard!
          </h1>
          <p className="text-gray-600 text-base leading-relaxed">
            Let&apos;s help to meet up your tasks.
          </p>
        </div>

        {/* Form inputs */}
        <div className="space-y-6 mb-10">
          <input
            id="name"
            type="text"
            placeholder="Enter your username"
            className="w-full px-6 py-4 rounded-4xl bg-white  outline-none focus:ring-2 focus:ring-blue-400 text-black placeholder-black"
          />
          <input
            id="password"
            type="password"
            placeholder="Enter Password"
            className="w-full px-6 py-4 rounded-4xl bg-white outline-none focus:ring-2 focus:ring-blue-400 text-black placeholder-black"
          />
          <input
            id="confirmPassword"
            type="password"
            placeholder="Confirm password"
            className="w-full px-6 py-4 rounded-4xl bg-white outline-none focus:ring-2 focus:ring-blue-400 text-black placeholder-black"
          />
        </div>
      </div>

      {/* Bottom buttons section */}
      <div className="px-8 pb-20 mx-auto">
        <button
          onClick={() => registerAccount()}
          className="w-[350px] bg-[#50C2C9] text-white rounded-lg py-4 text-[18px] font-bold shadow-sm mb-6"
        >
          Register
        </button>

        {/* Sign in link */}
        <p className="text-center text-gray-600">
          Already have an account?{" "}
          <button
            onClick={() => router.push("/auth/login")}
            className="text-[#50C2C9] font-medium"
          >
            Log in
          </button>
        </p>
      </div>
    </div>
  );
}
```

what is my next step?
