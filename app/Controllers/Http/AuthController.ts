import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import User from "App/Models/User";
// import Database from "@ioc:Adonis/Lucid/Database";
import { schema, rules } from '@ioc:Adonis/Core/Validator';
export default class AuthController {
  public async login({ request, auth }: HttpContextContract) {
    const email = request.input("email");
    const password = request.input("password");
    const token = await auth.use("api").attempt(email, password, {
      expiresIn: "10 days",
    });
    const data = {
      user: auth.user,
      token: token,
      message: 'User Login Successfully!'
    }
    return data
    return token.toJSON();
  }
  public async register({ request, auth }: HttpContextContract) {
    //  return await Database.rawQuery('drop table adonis_schema;');
    //  Request validation
    await this.validate(request);

    const email = request.input("email");
    const password = request.input("password");
    const name = request.input("name");
    const newUser = new User();
    newUser.email = email;
    newUser.password = password;
    newUser.name = name;
    await newUser.save();
    const token = await auth.use("api").login(newUser, {
      expiresIn: "10 days",
    });
    const data = {
      user: auth.user,
      token: token,
      message: 'User Registered Successfully!'
    }
    return data
    // return token.toJSON();
  }

  private async validate(request: Object) {
    await request.validate({
      schema: schema.create({
        name: schema.string({ trim: true }),
        password: schema.string({ trim: true, }, [rules.minLength(5), rules.confirmed()]),
        email: schema.string({ trim: true }, [
          rules.unique({ table: 'users', column: 'email' }),
          rules.email()

        ])
      }),
      messages: {
        'name.required': '{{ field }} is required',
        'email.unique': 'Account with this email is already exists',
        'password.required': '{{ field }} is required',
        'password.minLength': 'Password must be atleast 5 characters',
        'password.confirmed': 'Password & password confirmatin does not match!',

      }
    })
  }
}
