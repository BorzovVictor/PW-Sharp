using System.Collections.Generic;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using PW.SharedKernel;

namespace PW.Infrastructure
{
    public class EfRepository : IRepository
    {
        protected readonly AppDbContext Db;

        public EfRepository(AppDbContext db)
        {
            Db = db;
        }

        public T GetById<T>(int id) where T : BaseEntity
        {
            return Db.Set<T>().SingleOrDefault(e => e.Id == id);
        }

        public List<T> List<T>() where T : BaseEntity
        {
            return Db.Set<T>().ToList();
        }

        public T Add<T>(T entity) where T : BaseEntity
        {
            Db.Set<T>().Add(entity);
            Db.SaveChanges();

            return entity;
        }

        public void Delete<T>(T entity) where T : BaseEntity
        {
            Db.Set<T>().Remove(entity);
            Db.SaveChanges();
        }

        public void Update<T>(T entity) where T : BaseEntity
        {
            Db.Entry(entity).State = EntityState.Modified;
            Db.SaveChanges();
        }
    }
}
