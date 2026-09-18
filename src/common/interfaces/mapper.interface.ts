export interface MapperInterface<DomainEntity, DbRecord> {
  toDomain(raw: DbRecord): DomainEntity;
  toPersistence(domain: DomainEntity): any;
}
