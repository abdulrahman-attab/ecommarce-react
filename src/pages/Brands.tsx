import { Link } from 'react-router-dom';
import { faTags } from '@fortawesome/free-solid-svg-icons';
import { container, ErrorBox, PageBanner, Spinner } from '../components/common';
import { brandService } from '../api/services/brandService';
import { useFetch } from '../hooks/useFetch';

export default function Brands() {
  const { data, loading, error } = useFetch(() => brandService.list(), []);
  return (
    <>
      <PageBanner purple title="Top Brands" subtitle="Shop from your favorite brands" icon={faTags} crumbs={[{ label: 'Home', to: '/' }, { label: 'Brands' }]} />
      <div className={`${container} py-8`}>
        {loading ? <Spinner /> : error ? <ErrorBox message={error} /> : (
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
            {data?.map((b) => (
              <Link key={b._id} to={`/products?brand=${b._id}`} className="group rounded-2xl bg-white p-4 text-center shadow-sm ring-1 ring-slate-100 transition hover:-translate-y-0.5 hover:shadow-lg">
                <div className="flex h-36 items-center justify-center rounded-xl bg-slate-50 p-4"><div className="flex h-20 w-full items-center justify-center rounded bg-white"><img src={b.image} alt={b.name} loading="lazy" className="max-h-16 max-w-full object-contain" /></div></div>
                <h3 className="mt-4 text-sm font-medium text-slate-800 group-hover:text-purple-600">{b.name}</h3>
                <span className="block h-0 overflow-hidden text-xs font-medium text-purple-600 opacity-0 transition-all group-hover:mt-1 group-hover:h-4 group-hover:opacity-100">View Products →</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
