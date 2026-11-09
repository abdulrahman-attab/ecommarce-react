import { Link, useParams, useSearchParams } from 'react-router-dom';
import { FontAwesomeIcon as FA } from '@fortawesome/react-fontawesome';
import { faBox, faFilter, faXmark, faLayerGroup, faTags } from '@fortawesome/free-solid-svg-icons';
import { container, ErrorBox, PageBanner, Spinner } from '../components/common';
import { ProductGrid } from '../components/ProductCard';
import { productService } from '../api/services/productService';
import { categoryService } from '../api/services/categoryService';
import { brandService } from '../api/services/brandService';
import { useFetch } from '../hooks/useFetch';


export default function Products() {
  const params = useParams();
  const [sp] = useSearchParams();
  const category = params.categoryId || sp.get('category') || undefined;
  const brand = params.brandId || sp.get('brand') || undefined;
  const keyword = sp.get('keyword') || undefined;
  const sort = sp.get('sort') === 'newest' ? '-createdAt' : sp.get('sort') || undefined; // 'newest' -> '-createdAt' is an assumption

  const products = useFetch(() => productService.list({ limit: 40, category: undefined, 'category[in]': category, brand, keyword, sort }), [category, brand, keyword, sort]);
  const cat = useFetch(() => (category ? categoryService.get(category) : Promise.resolve(null)), [category]);
  const br = useFetch(() => (brand ? brandService.get(brand) : Promise.resolve(null)), [brand]);
  const items = products.data?.data ?? [];

  let title = 'All Products', subtitle = 'Explore our complete product collection';
  let crumbs = [{ label: 'Home', to: '/' }, { label: 'All Products' }];
  let image: string | undefined;
  if (category && cat.data) { title = cat.data.name; subtitle = `Browse products in ${cat.data.name}`; image = cat.data.image; crumbs = [{ label: 'Home', to: '/' }, { label: 'Categories', to: '/categories' }, { label: cat.data.name }]; }
  else if (brand && br.data) { title = br.data.name; subtitle = `Browse products from ${br.data.name}`; image = br.data.image; crumbs = [{ label: 'Home', to: '/' }, { label: 'Brands', to: '/brands' }, { label: br.data.name }]; }
  else if (keyword) { title = 'Search Results'; subtitle = `Results for "${keyword}"`; }
  const chips = [category && cat.data ? { l: cat.data.name, i: faLayerGroup } : null, brand && br.data ? { l: br.data.name, i: faTags } : null, keyword ? { l: `"${keyword}"`, i: faFilter } : null].filter(Boolean) as { l: string; i: typeof faBox }[];

  return (
    <>
      <PageBanner title={title} subtitle={subtitle} icon={faBox} image={image} crumbs={crumbs} />
      <div className={`${container} py-8`}>
        {chips.length > 0 && (
          <div className="mb-4 flex flex-wrap items-center gap-3 text-sm">
            <span className="flex items-center gap-2 font-medium text-slate-700"><FA icon={faFilter} />Active Filters:</span>
            {chips.map((c) => <span key={c.l} className="flex items-center gap-2 rounded-full border border-green-200 bg-green-50 px-3 py-1 text-green-700"><FA icon={c.i} className="text-xs" />{c.l}<Link to="/products" aria-label="Remove filter"><FA icon={faXmark} className="text-xs" /></Link></span>)}
            <Link to="/products" className="text-slate-500 underline">Clear all</Link>
          </div>
        )}
        {products.loading ? <Spinner /> : products.error ? <ErrorBox message={products.error} /> : (
          <>
            <p className="mb-4 text-sm text-slate-600">Showing {items.length} products</p>
            {items.length ? <ProductGrid items={items} /> : <div className="rounded-xl bg-white p-12 text-center text-slate-500 shadow-sm">No products found.</div>}
          </>
        )}
      </div>
    </>
  );
}
