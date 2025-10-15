const Balance = () => {
  return (
    <div className="absolute top-10 left-[75%] flex items-center gap-3">
      <div className="relative text-black px-4 py-2" id="balanceContainer">
        <div className="relative z-10 flex items-center gap-2">
          <img src="/coin.svg" alt="coin-icon" />
          <p className="text-3xl font-[800]">1000</p>
        </div>
      </div>
      <div className="relative text-black px-4 py-2" id="balanceContainer">
        <div className="relative z-10 flex items-center gap-2">
          <img src="/gem.svg" alt="coin-icon" />
          <p className="text-3xl font-[800]">35</p>
        </div>
      </div>
    </div>
  );
};

export default Balance;
