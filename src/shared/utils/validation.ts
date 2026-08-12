import { joiResolver } from "@hookform/resolvers/joi";
import Joi, { type Reference, type ReferenceOptions } from "joi";
interface Root<TSchema> extends Omit<Joi.Root, "ref"> {
  ref(key: keyof TSchema, options?: ReferenceOptions): Reference;
}
type Func<T> = (v: Root<T>) => Joi.PartialSchemaMap<T>;
function create<T>(v: Func<T>) {
  return Joi.compile(
    Joi.object<T>(v(Joi as Root<T>)).options({
      stripUnknown: true,
      presence: "optional",
    }),
  );
}
const resolver = joiResolver;
export default { create, resolver };
