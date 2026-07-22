import React from 'react';
import { CHARACTERS, XP, LEVELS } from '../constants';
import { motion } from 'motion/react';

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

export const ModulView: React.FC = () => {
  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-4">
      <motion.div variants={itemVariants} className="bg-indigo-600 text-white rounded-2xl p-8 shadow-sm text-center">
        <h1 className="text-2xl md:text-3xl font-bold mb-4">MODUL PELATIHAN GURU MI</h1>
        <h2 className="text-xl md:text-2xl font-semibold opacity-90 mb-6">"Menjadi Guru Gen Alfa: Praktik Pembelajaran Berbasis Gamifikasi Berkolaborasi STEAM"</h2>
        <div className="bg-white/10 p-4 rounded-xl inline-block text-left text-sm space-y-2">
          <p><strong>Tema:</strong> Mengajar Bukan Sekadar Menyampaikan Materi, tetapi Mendesain Pengalaman Belajar yang Menyenangkan, Bermakna, dan Menantang.</p>
          <p><strong>Durasi:</strong> 1 Hari (6–8 Jam)</p>
          <p><strong>Peserta:</strong> Guru MI</p>
          <p><strong>Metode:</strong> Experiential Learning, Project Based Learning, Design Thinking, Gamification, Collaborative Learning, Microteaching</p>
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="bg-white/90 backdrop-blur-md border border-[var(--color-line)] rounded-2xl p-6 shadow-sm">
        <h2 className="text-xl font-bold text-[var(--color-ink)] mb-4 flex items-center gap-2">🎯 Tujuan Pelatihan</h2>
        <p className="text-[var(--color-muted)] text-sm mb-4">Setelah mengikuti pelatihan, peserta mampu:</p>
        <ul className="list-none space-y-2">
          {["Memahami karakteristik Generasi Alpha.", "Mendesain pembelajaran berbasis gamifikasi.", "Mengintegrasikan pendekatan STEAM dalam pembelajaran MI.", "Mengembangkan aktivitas belajar yang aktif, kreatif, menyenangkan, dan bermakna.", "Mempraktikkan pembelajaran melalui microteaching."].map(t => (
            <li key={t} className="pl-6 relative before:content-['✔'] before:absolute before:left-0 before:text-indigo-600 before:font-bold text-sm text-[var(--color-ink)]">{t}</li>
          ))}
        </ul>
      </motion.div>
      
      <motion.div variants={itemVariants} className="bg-white/90 backdrop-blur-md border border-[var(--color-line)] rounded-2xl p-6 shadow-sm">
        <h2 className="text-xl font-bold text-[var(--color-ink)] mb-4 flex items-center gap-2">⏱️ Rundown Pelatihan</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse">
            <thead>
              <tr className="bg-white/50 border-b border-slate-200">
                <th className="py-2 px-4 font-bold text-slate-700">Waktu</th>
                <th className="py-2 px-4 font-bold text-slate-700">Kegiatan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-slate-600">
              <tr><td className="py-2 px-4 font-mono">08.00-08.30</td><td className="py-2 px-4">Ice Breaking & Opening Mission</td></tr>
              <tr><td className="py-2 px-4 font-mono">08.30-09.15</td><td className="py-2 px-4">Sesi 1. Mengenal Gen Alpha</td></tr>
              <tr><td className="py-2 px-4 font-mono">09.15-10.15</td><td className="py-2 px-4">Sesi 2. Mengapa Gamifikasi?</td></tr>
              <tr><td className="py-2 px-4 font-mono">10.15-10.30</td><td className="py-2 px-4 italic text-slate-400">Coffee Break</td></tr>
              <tr><td className="py-2 px-4 font-mono">10.30-12.00</td><td className="py-2 px-4">Sesi 3. Workshop Mendesain Gamifikasi STEAM</td></tr>
              <tr><td className="py-2 px-4 font-mono">12.00-13.00</td><td className="py-2 px-4 italic text-slate-400">Istirahat</td></tr>
              <tr><td className="py-2 px-4 font-mono">13.00-15.00</td><td className="py-2 px-4">Sesi 4. Praktik Menjadi Guru</td></tr>
              <tr><td className="py-2 px-4 font-mono">15.00-15.30</td><td className="py-2 px-4">Challenge Presentasi</td></tr>
              <tr><td className="py-2 px-4 font-mono">15.30-16.00</td><td className="py-2 px-4">Refleksi dan Reward</td></tr>
            </tbody>
          </table>
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="bg-white/90 backdrop-blur-md border border-[var(--color-line)] rounded-2xl p-6 shadow-sm">
        <div className="text-[10px] tracking-widest uppercase text-[var(--color-muted)] font-bold mb-1">Ice Breaking</div>
        <h2 className="text-xl font-bold text-[var(--color-ink)] mb-2 flex items-center gap-2">🧩 "Guru Level Up"</h2>
        <p className="mb-4 text-sm text-[var(--color-ink)]">Setiap peserta mendapat kartu karakter. Setiap aktivitas memperoleh XP (Experience Point). Di akhir pelatihan akan naik level.</p>
        <div className="flex flex-wrap gap-2 my-4">
          {CHARACTERS.map(c => <span key={c} className="inline-block px-3 py-1 rounded-md text-xs font-bold bg-indigo-50 text-indigo-700">{c}</span>)}
        </div>
        <h3 className="font-bold text-sm text-[var(--color-ink)] my-3">Perolehan XP</h3>
        <div className="flex flex-wrap gap-2 mb-4">
          {Object.entries(XP).map(([k,v]) => <span key={k} className="inline-block px-3 py-1 rounded-md text-xs font-bold bg-emerald-50 text-emerald-700">{k} = +{v} XP</span>)}
        </div>
        <h3 className="font-bold text-sm text-[var(--color-ink)] my-3">Jenjang level</h3>
        <div className="flex flex-wrap gap-2 items-center my-4">
          {LEVELS.map((l, i) => (
            <React.Fragment key={l.name}>
              <span className="bg-amber-50 text-amber-700 px-3 py-1.5 rounded-md font-bold text-xs">Level {i+1}<br/>{l.name}</span>
              {i < LEVELS.length - 1 && <span className="text-[var(--color-muted)] text-sm">↓</span>}
            </React.Fragment>
          ))}
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="bg-white/90 backdrop-blur-md border border-[var(--color-line)] rounded-2xl p-6 shadow-sm">
        <div className="text-[10px] tracking-widest uppercase text-[var(--color-muted)] font-bold mb-1">Sesi 1</div>
        <h2 className="text-xl font-bold text-[var(--color-ink)] mb-4 flex items-center gap-2">👶 Mengenal Generasi Alpha</h2>
        
        <h3 className="font-bold text-sm text-[var(--color-ink)] mb-2 text-indigo-700">Aktivitas Kelompok · Challenge 1: "Siapa Mereka?"</h3>
        <p className="text-sm text-[var(--color-ink)] mb-4">Setiap kelompok memperoleh gambar anak-anak. <strong>Tugas:</strong> Diskusikan kebiasaan mereka, cara belajar mereka, tantangan guru, harapan orang tua. Presentasikan dalam waktu 3 menit.</p>
        
        <h3 className="font-bold text-sm text-[var(--color-ink)] mb-2 text-indigo-700">Materi</h3>
        <p className="text-sm text-[var(--color-ink)] mb-2">Generasi Alpha lahir setelah 2010. Karakteristik:</p>
        <ul className="list-none space-y-2 mt-2 mb-4 text-sm text-[var(--color-ink)]">
          {["Digital Native", "Cepat bosan", "Suka visual", "Suka tantangan", "Belajar melalui pengalaman", "Senang kolaborasi", "Ingin mendapat umpan balik cepat"].map(t => (
            <li key={t} className="pl-6 relative before:content-['✔'] before:absolute before:left-0 before:text-indigo-600 before:font-bold">{t}</li>
          ))}
        </ul>
        <p className="text-sm text-[var(--color-ink)] mb-4 bg-white/50 p-3 rounded-lg border border-slate-100">Maka guru harus berubah. Dari... <span className="font-bold line-through text-slate-400">Teacher Center</span> menjadi <span className="font-bold text-indigo-600">Learning Designer</span>.</p>
        
        <h3 className="font-bold text-sm text-[var(--color-ink)] mb-2 text-indigo-700">Aktivitas Seru: "Guru Jadul vs Guru Gen Alpha"</h3>
        <p className="text-sm text-[var(--color-ink)]">Setiap kelompok membuat drama singkat. Kelompok A: Mengajar tahun 1995. Kelompok B: Mengajar tahun 2026. Peserta lain menilai. Pasti ramai dan lucu.</p>
      </motion.div>
      
      <motion.div variants={itemVariants} className="bg-white/90 backdrop-blur-md border border-[var(--color-line)] rounded-2xl p-6 shadow-sm">
        <div className="text-[10px] tracking-widest uppercase text-[var(--color-muted)] font-bold mb-1">Sesi 2</div>
        <h2 className="text-xl font-bold text-[var(--color-ink)] mb-4 flex items-center gap-2">🎮 Gamifikasi</h2>
        
        <p className="text-sm text-[var(--color-ink)] mb-4 italic border-l-4 border-indigo-200 pl-3">Mulailah dengan pertanyaan. "Kenapa anak bisa bermain Roblox selama 3 jam tetapi belajar 20 menit sudah bosan?"</p>
        
        <h3 className="font-bold text-sm text-[var(--color-ink)] mb-2 text-indigo-700">Materi Gamifikasi</h3>
        <p className="text-sm text-[var(--color-ink)] mb-2">Yang membuat game menarik bukan gambarnya. Tetapi: tujuan, level, tantangan, hadiah, kolaborasi, cerita, pencapaian.</p>
        <p className="text-sm text-[var(--color-ink)] mb-2 mt-4 font-semibold">Komponen utama:</p>
        <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-slate-600">
          Mission &rarr; Challenge &rarr; Point &rarr; Badge &rarr; Level &rarr; Reward &rarr; Leaderboard &rarr; Boss Battle
        </div>
        
        <h3 className="font-bold text-sm text-[var(--color-ink)] mt-6 mb-2 text-indigo-700">Aktivitas: Escape Mission</h3>
        <p className="text-sm text-[var(--color-ink)]">Setiap kelompok harus membuka "Kotak Misteri." Di dalam kotak terdapat: Puzzle, QR Code, Petunjuk, Potongan gambar, Kode angka. Kelompok harus menyelesaikan misi. Tanpa sadar mereka sedang belajar gamifikasi.</p>
      </motion.div>
      
      <motion.div variants={itemVariants} className="bg-white/90 backdrop-blur-md border border-[var(--color-line)] rounded-2xl p-6 shadow-sm">
        <div className="text-[10px] tracking-widest uppercase text-[var(--color-muted)] font-bold mb-1">Sesi 3</div>
        <h2 className="text-xl font-bold text-[var(--color-ink)] mb-4 flex items-center gap-2">🔬 STEAM</h2>
        
        <p className="text-sm text-[var(--color-ink)] mb-4 bg-white/50 p-3 rounded-lg border border-slate-100">STEAM bukan lima mata pelajaran. Tetapi cara berpikir. Science, Technology, Engineering, Arts, Mathematics. Semuanya digunakan untuk menyelesaikan masalah nyata.</p>
        
        <h3 className="font-bold text-sm text-[var(--color-ink)] mb-2 text-indigo-700">Aktivitas Besar: "Mission Impossible"</h3>
        <p className="text-sm text-[var(--color-ink)] mb-2">Tema: <strong>"Banjir di Sekolah"</strong></p>
        <p className="text-sm text-[var(--color-ink)] mb-2">Setiap kelompok diberi: Sedotan, Kertas, Lego, Plastisin, Benang, Selotip, Gelas. Mereka diminta membuat miniatur solusi.</p>
        <p className="text-sm text-[var(--color-ink)] mb-4">Kelompok memperoleh poin: Inovasi, Kolaborasi, Kreativitas, Keindahan, Presentasi.</p>
        
        <h3 className="font-bold text-sm text-[var(--color-ink)] mb-2 text-indigo-700">Contoh Integrasi</h3>
        <ul className="text-sm text-[var(--color-ink)] space-y-1">
          <li><strong>Science:</strong> Mengapa banjir terjadi?</li>
          <li><strong>Technology:</strong> Menggunakan Canva.</li>
          <li><strong>Engineering:</strong> Merancang saluran air.</li>
          <li><strong>Arts:</strong> Poster.</li>
          <li><strong>Math:</strong> Menghitung debit sederhana.</li>
        </ul>
      </motion.div>
      
      <motion.div variants={itemVariants} className="bg-white/90 backdrop-blur-md border border-[var(--color-line)] rounded-2xl p-6 shadow-sm">
        <div className="text-[10px] tracking-widest uppercase text-[var(--color-muted)] font-bold mb-1">Sesi 4</div>
        <h2 className="text-xl font-bold text-[var(--color-ink)] mb-4 flex items-center gap-2">🎓 Praktik Menjadi Guru</h2>
        
        <h3 className="font-bold text-sm text-[var(--color-ink)] mb-2 text-indigo-700">Tantangan</h3>
        <p className="text-sm text-[var(--color-ink)] mb-2">Setiap kelompok mendapat tema. Contoh: Shalat, Hewan, Air, Energi, Pahlawan, Lingkungan, Bilangan, Bangun Datar, Zakat, Tumbuhan.</p>
        <p className="text-sm text-[var(--color-ink)] mb-4">Mereka harus membuat pembelajaran (durasi 30 menit) yang memiliki: Story, Mission, Level, STEAM, Reward, Penilaian.</p>
        
        <div className="bg-white/50 border border-[var(--color-line)] p-4 rounded-xl mb-6">
          <h4 className="font-bold text-sm text-[var(--color-ink)] mb-2">Contoh Game: "Menyelamatkan Planet Hijau"</h4>
          <ul className="text-sm text-[var(--color-ink)] space-y-1">
            <li><strong>Cerita:</strong> Planet kehilangan pohon. Setiap kelompok menjadi tim penyelamat.</li>
            <li><strong>Level 1:</strong> Mencari kartu daun.</li>
            <li><strong>Level 2:</strong> Mengelompokkan tumbuhan.</li>
            <li><strong>Level 3:</strong> Merancang taman.</li>
            <li><strong>Boss Battle:</strong> Presentasi solusi.</li>
            <li><strong>Reward:</strong> Badge Green Hero</li>
          </ul>
        </div>
        
        <h3 className="font-bold text-sm text-[var(--color-ink)] mb-2 text-indigo-700">Microteaching</h3>
        <p className="text-sm text-[var(--color-ink)] mb-4">Setiap kelompok tampil 15 menit. Peserta lain menjadi murid SD. Harus benar-benar bermain. Boleh teriak. Boleh bernyanyi. Boleh bergerak. Boleh berdiskusi. Semakin hidup semakin bagus.</p>
        
        <h3 className="font-bold text-sm text-[var(--color-ink)] mb-2 text-indigo-700">Praktik Kolaboratif: Battle Guru</h3>
        <p className="text-sm text-[var(--color-ink)] mb-4">Setiap kelompok saling bertukar RPP. Kelompok lain menjadi validator. Harus memberi: 2 Kelebihan, 2 Saran, 1 Ide Baru.</p>
        
        <h3 className="font-bold text-sm text-[var(--color-ink)] mb-2 text-indigo-700">Aktivitas Penutup: Reflection Wall</h3>
        <p className="text-sm text-[var(--color-ink)]">Semua peserta mendapat sticky note. Tuliskan: "Saya akan mengubah..." Tempel di papan.</p>
      </motion.div>
      
      <motion.div variants={itemVariants} className="bg-indigo-50 border border-indigo-100 rounded-2xl p-6 shadow-sm">
        <h2 className="text-xl font-bold text-indigo-900 mb-4 flex items-center gap-2">🚀 Bonus: Tantangan Besar</h2>
        <h3 className="font-bold text-sm text-indigo-800 mb-2">"Design Thinking Sprint" (Waktu: 90 menit)</h3>
        <p className="text-sm text-indigo-900 mb-2">Setiap kelompok membuat pembelajaran lengkap. Harus memiliki:</p>
        <ul className="list-none space-y-1 mt-2 mb-4 text-sm text-indigo-900">
          {["Storyline", "Avatar", "Logo Game", "Kartu Misi", "Badge", "Rubrik Penilaian", "Reward", "LKPD", "Media", "Presentasi"].map(t => (
            <li key={t} className="pl-6 relative before:content-['✔'] before:absolute before:left-0 before:text-indigo-600 before:font-bold">{t}</li>
          ))}
        </ul>
        <p className="text-sm text-indigo-900">Selanjutnya dipresentasikan layaknya mengikuti kompetisi inovasi pembelajaran.</p>
      </motion.div>
    </motion.div>
  );
};
