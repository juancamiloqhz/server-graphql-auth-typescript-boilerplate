import { Resolver, Query, Mutation, Arg } from "type-graphql";
import { User } from "./entity/User";
import { hash } from "bcryptjs";

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
}
