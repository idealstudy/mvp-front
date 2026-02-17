const QnASectionContent = () => {
  // 추후 수정
  return (
    <div className="flex h-22 w-full flex-col items-center justify-center gap-3">
      <div className="relative mx-auto rotate-[10deg] rounded-2xl bg-[#FF6B4A] px-5 py-2 text-white shadow-xl">
        <span className="text-xl font-black tracking-widest uppercase md:text-base">
          Coming Soon
        </span>
        <div className="absolute -bottom-1 left-6 h-3 w-3 rotate-45 bg-[#FF6B4A]"></div>
      </div>
    </div>
  );
};

export default QnASectionContent;
