import { ConfigureFactory, ConfigureRegister } from "../core/type";
import { ContentConfig } from "../search/type";

export const createContentConfig:(
  register:ConfigureRegister<Partial<ContentConfig>>
  )=> ConfigureFactory<Partial<ContentConfig>,ContentConfig>=
  register=>({
    register,
    defaultRegister:()=>({searchType:'against'})
  })
