import Link from "next/link";

export function Brand() { return <Link href="/" className="brand"><span className="brand-mark">M</span><span>MapleLeaf Education<small>Study in Canada Agency</small></span></Link>; }

export function PublicNav() { return <nav className="public-nav"><div className="container nav-inner"><Brand/><div className="nav-links"><Link href="/courses">หลักสูตร</Link><Link href="/about">เกี่ยวกับเรา</Link><Link href="/contact">ติดต่อ</Link><Link className="button button-secondary" href="/login">เข้าสู่ระบบ</Link><Link className="button button-primary" href="/register">เริ่มต้นใช้งาน</Link></div></div></nav>; }

export function Footer() { return <footer className="footer"><div className="container"><Brand/><p style={{marginTop:16}}>ระบบ Pilot — กรุณาอย่าอัปโหลดข้อมูลส่วนบุคคลจริง</p><small>© 2026 MapleLeaf Education. Demo environment.</small></div></footer>; }
