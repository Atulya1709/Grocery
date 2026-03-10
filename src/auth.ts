import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import connectDb from "./lib/db";
import bcrypt from "bcryptjs";
import User from "./app/models/user.model";
export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: {
          label: "email",
          type: "email",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentails, request) {
        await connectDb();
        const email = credentails.email;
        const password = credentails.password as string;
        const user = await User.findOne({ email });
        if (!user) {
          throw new Error("user does not exist");
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          throw new Error("incorrect password");
        }
        return {
          id: user._id,
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        ((token.id = user.id),
          (token.name = user.name),
          (token.email = user.email),
          (token.role = user.role));
      }
      return token;
    },
    session({session,token}){
      if (session.user)
        

    },
  },
});

//connect db
//email check
//password match
