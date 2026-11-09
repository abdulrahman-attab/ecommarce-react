import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { FontAwesomeIcon as FA } from '@fortawesome/react-fontawesome';
import { faHeadset, faPhone, faEnvelope, faLocationDot, faClock, faPaperPlane, faQuestion } from '@fortawesome/free-solid-svg-icons';
import { faFacebookF, faTwitter, faInstagram, faLinkedinIn } from '@fortawesome/free-brands-svg-icons';
import { container, Field, inputCls, PageBanner } from '../components/common';
import { contactSchema } from '../schemas/schemas';
import { useToast } from '../context/ToastContext';

type V = z.infer<typeof contactSchema>;
export default function Contact() {
  const toast = useToast();
  const { register, handleSubmit, formState: { errors } } = useForm<V>({ resolver: zodResolver(contactSchema) });
  const card = 'rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-100';
  const ico = (i: typeof faPhone) => <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-green-50 text-green-600"><FA icon={i} /></span>;
  return (
    <>
      <PageBanner title="Contact Us" subtitle="We'd love to hear from you. Get in touch with our team." icon={faHeadset} crumbs={[{ label: 'Home', to: '/' }, { label: 'Contact Us' }]} />
      <div className={`${container} grid gap-6 py-10 lg:grid-cols-[360px_1fr]`}>
        <div className="space-y-4">
          <div className={`${card} flex gap-4`}>{ico(faPhone)}<div><p className="font-semibold">Phone</p><p className="text-xs text-slate-500">Mon-Fri from 8am to 6pm</p><a href="tel:+18001234567" className="text-sm font-medium text-green-600">+1 (800) 123-4567</a></div></div>
          <div className={`${card} flex gap-4`}>{ico(faEnvelope)}<div><p className="font-semibold">Email</p><p className="text-xs text-slate-500">We&apos;ll respond within 24 hours</p><a href="mailto:support@freshcart.com" className="text-sm font-medium text-green-600">support@freshcart.com</a></div></div>
          <div className={`${card} flex gap-4`}>{ico(faLocationDot)}<div><p className="font-semibold">Office</p><p className="text-xs leading-relaxed text-slate-500">123 Commerce Street<br />New York, NY 10001<br />United States</p></div></div>
          <div className={`${card} flex gap-4`}>{ico(faClock)}<div><p className="font-semibold">Business Hours</p><p className="text-xs leading-relaxed text-slate-500">Monday - Friday: 8am - 6pm<br />Saturday: 9am - 4pm<br />Sunday: Closed</p></div></div>
          <div className={card}><p className="mb-3 font-semibold">Follow Us</p><div className="flex gap-3">{[faFacebookF, faTwitter, faInstagram, faLinkedinIn].map((i, k) => <a key={k} href="#" className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-sm text-slate-500 hover:bg-green-600 hover:text-white"><FA icon={i} /></a>)}</div></div>
        </div>
        <div className="space-y-5">
          <form noValidate onSubmit={handleSubmit(() => toast('The contact form is not connected to a backend yet — please email support@freshcart.com', 'info'))} className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
            <div className="mb-5 flex items-center gap-3">{ico(faHeadset)}<div><h2 className="font-bold">Send us a Message</h2><p className="text-xs text-slate-500">Fill out the form and we&apos;ll get back to you</p></div></div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Full Name" error={errors.name?.message}><input className={inputCls} placeholder="John Doe" {...register('name')} /></Field>
              <Field label="Email Address" error={errors.email?.message}><input className={inputCls} placeholder="john@example.com" {...register('email')} /></Field>
            </div>
            <div className="mt-4"><Field label="Subject" error={errors.subject?.message}>
              <select className={inputCls} defaultValue="" {...register('subject')}><option value="" disabled>Select a subject</option>{['Order Inquiry', 'Shipping & Delivery', 'Returns & Refunds', 'Product Question', 'Other'].map((s) => <option key={s}>{s}</option>)}</select></Field></div>
            <div className="mt-4"><Field label="Message" error={errors.message?.message}><textarea rows={4} className={inputCls} placeholder="How can we help you?" {...register('message')} /></Field></div>
            <button className="mt-5 flex items-center gap-2 rounded-lg bg-green-600 px-6 py-3 text-sm font-semibold text-white hover:bg-green-700"><FA icon={faPaperPlane} />Send Message</button>
          </form>
          <div className="flex items-start gap-4 rounded-xl bg-green-50 p-5 ring-1 ring-green-100"><span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-green-600"><FA icon={faQuestion} /></span><div><p className="font-semibold">Looking for quick answers?</p><p className="text-sm text-slate-600">Check out our Help Center for frequently asked questions about orders, shipping, returns, and more.</p><Link to="/help" className="mt-2 inline-block text-sm font-medium text-green-600">Visit Help Center →</Link></div></div>
        </div>
      </div>
    </>
  );
}
