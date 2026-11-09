import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon as FA } from '@fortawesome/react-fontawesome';
import { faCartShopping, faHouse, faArrowLeft, faAppleWhole, faCarrot, faLeaf } from '@fortawesome/free-solid-svg-icons';
import { btnLight, btnPrimary } from '../components/common';

export default function NotFound() {
  const nav = useNavigate();
  return (
    <div className="relative flex min-h-[70vh] flex-col items-center justify-center overflow-hidden bg-linear-to-b from-green-50/60 to-white px-4 py-20 text-center">
      <FA icon={faAppleWhole} className="absolute left-[5%] top-[12%] text-2xl text-green-300" />
      <FA icon={faCarrot} className="absolute right-[12%] top-[20%] text-2xl text-green-300" />
      <FA icon={faLeaf} className="absolute bottom-[15%] left-[8%] text-2xl text-green-300" />
      <div className="relative mb-8">
        <div className="flex h-32 w-36 items-center justify-center rounded-3xl bg-white text-6xl text-green-300 shadow-xl"><FA icon={faCartShopping} /></div>
        <span className="absolute -right-5 -top-4 flex h-14 w-14 items-center justify-center rounded-full bg-green-600 text-lg font-extrabold text-white shadow-lg">404</span>
      </div>
      <h1 className="text-4xl font-extrabold text-slate-900">Oops! Nothing Here</h1>
      <p className="mt-4 max-w-sm text-sm text-slate-500">Looks like this page went out of stock! Don&apos;t worry, there&apos;s plenty more fresh content to explore.</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link to="/" className={btnPrimary}><FA icon={faHouse} />Go to Homepage</Link>
        <button onClick={() => nav(-1)} className={btnLight}><FA icon={faArrowLeft} />Go Back</button>
      </div>
    </div>
  );
}
