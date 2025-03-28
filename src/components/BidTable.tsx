import { Bid } from '../types';

interface BidTableProps {
  bids: Bid[];
  currentUserAlias: string;
}

export const BidTable = ({ bids, currentUserAlias }: BidTableProps) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-neutral-light/30">
          <tr>
            <th className="px-6 py-3 text-left text-sm font-semibold text-dark">
              Prisplacering
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-dark">
              Alias
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-dark">
              Heltäckande offert
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-dark">
              Inlämningsdatum
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-light">
          {bids.map((bid, index) => (
            <tr 
              key={bid.id}
              className={`
                ${bid.alias === currentUserAlias ? 'bg-primary-dark' : 'bg-white'}
                hover:bg-neutral-light/10 transition-colors duration-150
              `}
            >
              <td className="px-6 py-4 text-sm text-dark">
                {index + 1}
              </td>
              <td className="px-6 py-4 text-sm text-dark">
                {bid.alias} {bid.isJoker && '(joker)'}
              </td>
              <td className="px-6 py-4 text-sm text-dark">
                {bid.coverage}%
              </td>
              <td className="px-6 py-4 text-sm text-dark">
                {bid.submissionDate ? new Date(bid.submissionDate).toLocaleDateString('sv-SE') : '-'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}; 