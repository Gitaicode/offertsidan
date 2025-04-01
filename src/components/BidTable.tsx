import { Bid } from '../types';
import { User } from '../types';

interface BidTableProps {
  bids: Bid[];
  currentUser: User | null;
}

export const BidTable = ({ bids, currentUser }: BidTableProps) => {
  return (
    <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0 }}>
      <thead>
        <tr>
          <th style={{ 
            textAlign: 'left', 
            fontWeight: 'normal', 
            borderBottom: '1px solid #D1D5DB', 
            paddingBottom: '0.5rem' 
          }}>
            Prisplacering
          </th>
          <th style={{ 
            textAlign: 'left', 
            fontWeight: 'normal', 
            borderBottom: '1px solid #D1D5DB', 
            paddingBottom: '0.5rem' 
          }}>
            Alias
          </th>
          <th style={{ 
            textAlign: 'left', 
            fontWeight: 'normal', 
            borderBottom: '1px solid #D1D5DB', 
            paddingBottom: '0.5rem' 
          }}>
            Heltäckande offert
          </th>
          <th style={{ 
            textAlign: 'left', 
            fontWeight: 'normal', 
            borderBottom: '1px solid #D1D5DB', 
            paddingBottom: '0.5rem' 
          }}>
            Inlämningsdatum
          </th>
        </tr>
      </thead>
      <tbody>
        {bids.map((bid, index) => (
          <tr key={bid.id}>
            <td style={{ 
              padding: '0.5rem 0', 
              borderBottom: '1px solid #D1D5DB' 
            }}>
              {index + 1}
            </td>
            <td style={{ 
              padding: '0.5rem 0', 
              borderBottom: '1px solid #D1D5DB' 
            }}>
              {bid.alias}{bid.alias === currentUser?.alias ? ' (du)' : ''}
            </td>
            <td style={{ 
              padding: '0.5rem 0', 
              borderBottom: '1px solid #D1D5DB' 
            }}>
              {bid.coverage}%
            </td>
            <td style={{ 
              padding: '0.5rem 0', 
              borderBottom: '1px solid #D1D5DB' 
            }}>
              {bid.submissionDate ? new Date(bid.submissionDate).toLocaleDateString('sv-SE') : '-'}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}; 