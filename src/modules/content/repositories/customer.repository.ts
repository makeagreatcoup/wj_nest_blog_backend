
import { BaseRepository } from '@/modules/database/base/repository';
import { CustomRepository } from '@/modules/database/decorators/repository.decorator';

import { CustomerEntity } from '../entities';

@CustomRepository(CustomerEntity)
export class CustomerRepository extends BaseRepository<CustomerEntity> {
  protected _qbName='customer';
  
  protected orderBy = 'createdAt';
  
  buildBaseQB() {
    return this.createQueryBuilder(this.qbName)
      .leftJoinAndSelect(`${this.qbName}.user`,'user')
      
      ;
  }
}
