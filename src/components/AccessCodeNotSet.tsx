type Props = {
  personName: string;
};

export function AccessCodeNotSet({ personName }: Props) {
  return (
    <div className="min-h-[100dvh] flex items-center justify-center bg-zinc-950 px-6">
      <div className="max-w-md text-center text-white space-y-3">
        <p className="text-4xl">🔐</p>
        <h1 className="text-xl font-bold">{personName}</h1>
        <p className="text-white/60 text-sm leading-relaxed">
          এই পেজের গোপন কোড এখনো সেট করা হয়নি। অ্যাডমিন প্যানেল থেকে কোড যোগ
          করুন।
        </p>
      </div>
    </div>
  );
}
