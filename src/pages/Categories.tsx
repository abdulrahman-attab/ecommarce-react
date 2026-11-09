import { Link } from 'react-router-dom';
import { faLayerGroup } from '@fortawesome/free-solid-svg-icons';
import { container, ErrorBox, PageBanner, Spinner } from '../components/common';
import { categoryService } from '../api/services/categoryService';
import { useFetch } from '../hooks/useFetch';

export default function Categories() {
  const { data, loading, error } = useFetch(() => categoryService.list(), []);
  return (
    <>
      <PageBanner title="All Categories" subtitle="Browse our wide range of product categories" icon={faLayerGroup} crumbs={[{ label: 'Home', to: '/' }, { label: 'Categories' }]} />
      <div className={`${container} py-8`}>
        {loading ? <Spinner /> : error ? <ErrorBox message={error} /> : (
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-5">
            {data?.map((c) => (
              <Link key={c._id} to={`/categories/${c._id}`} className="flex flex-col items-center rounded-xl bg-white p-6 text-center shadow-sm transition hover:shadow-md">
                <img src={c.image} alt={c.name} className="mb-4 h-28 w-28 rounded-full object-cover" />
                <span className="font-semibold text-slate-800">{c.name}</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
