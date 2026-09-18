export interface BaseRepositoryInterface<T> {
  /**
   * Busca un registro por su identificador único.
   * @param id Identificador del registro.
   * @returns La entidad encontrada o null si no existe.
   */
  findById(id: string): Promise<T | null>;

  /**
   * Verifica si un registro existe en la base de datos mediante su ID.
   * Altamente recomendado para validaciones de rendimiento.
   * @param id Identificador del registro.
   * @returns true si existe, false en caso contrario.
   */
  exists(id: string): Promise<boolean>;

  /**
   * Crea y persiste un nuevo registro en la base de datos.
   * @param entity La entidad de dominio a persistir.
   * @returns La entidad persistida con los datos actualizados (ej. fechas).
   */
  create(entity: T): Promise<T>;
}
