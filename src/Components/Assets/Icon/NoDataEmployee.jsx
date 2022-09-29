import NoData from "./NoData";

export default function NoDataEmployee() {
  return (
    <div className="mx-auto my-auto flex text-grey items-center justify-center flex-col gap-5">
      <NoData className="w-32 h-32" />
      <p className="text-2xl font-normal">No employee yet</p>
    </div>
  );
}
