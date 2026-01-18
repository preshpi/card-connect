type StepCardProps = {
  step: string;
  title: string;
  from: string;
  to: string;
};

const StepCard = ({ step, title, from, to }: StepCardProps) => {
  return (
    <div
      className={`
        relative rounded-2xl px-8 py-18 text-center border border-[#E5E7EB]
        bg-linear-to-br ${from} ${to}
        transition-all duration-300 hover:scale-110

      `}
    >
      <span className="inline-block mb-4 px-4 py-1 text-sm rounded-full border border-[#7269E3] text-[#7269E3] bg-white">
        {step}
      </span>
      <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
    </div>
  );
};
export default StepCard;
