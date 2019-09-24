import {
  Resolver,
  Query,
  Mutation,
  Arg,
  ObjectType,
  Field,
  Ctx
} from "type-graphql";
import { User } from "./entity/User";
import { hash, compare } from "bcryptjs";
import { sign } from "jsonwebtoken";
import { MyContext } from "./MyContext";

@ObjectType()
class LoginResponse {
  @Field()
  accessToken: string;
}

@Resolver()
export class UserResolver {
  @Query(() => String)
  hello() {
    return "hi!";
  }

  @Query(() => [User])
  users() {
    return User.find();
  }

  @Mutation(() => Boolean)
  async register(
    @Arg("firstName") firstName: string,
    @Arg("lastName") lastName: string,
    @Arg("email") email: string,
    @Arg("password") password: string,
    @Arg("age") age: number
  ) {
    const lowerCaseEmail = email.toLowerCase().trim();
    const hashedPassword = await hash(password, 12);
    try {
      await User.insert({
        firstName,
        lastName,
        email: lowerCaseEmail,
        password: hashedPassword,
        age
      });
    } catch (error) {
      console.log(error);
      return false;
    }

    return true;
  }

  @Mutation(() => LoginResponse)
  async login(
    @Arg("email") email: string,
    @Arg("password") password: string,
    @Ctx() { res }: MyContext
  ): Promise<LoginResponse> {
    const lowerCaseEmail = email.toLowerCase().trim();
    const user = await User.findOne({ where: { email: lowerCaseEmail } });

    if (!user) {
      throw new Error(`No user found with email: ${lowerCaseEmail}`);
    }

    const valid = await compare(password, user.password);

    if (!valid) throw new Error(`Invalid password!`);

    res.cookie(
      "jid",
      sign({ userId: user.id }, "oiasoasogfosafog", { expiresIn: "7d" }),
      { httpOnly: true }
    );

    return {
      accessToken: sign({ userId: user.id }, "sdasfdgasfg", {
        expiresIn: "15m"
      })
    };
  }
}
