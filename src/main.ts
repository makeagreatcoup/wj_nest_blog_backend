import { creator } from './creator';
import { bootApp } from './modules/core/helpers';
import { echoApi } from './modules/restful/helpers';
import { Restful } from './modules/restful/restful';


// async function bootstrap() {
//   const app = await NestFactory.create(AppModule);
//   await app.listen(3000);
// }
// bootstrap();

bootApp(creator, ({ app, configure }) => async () => {
  const restful = app.get(Restful);
  echoApi(configure, restful);
});
