'use server'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { User, Organisation } from "@/lib/types"
import { loadPocketBase } from "@/lib/pocketbase"
import { getUsersShifts } from "@/lib/scheduling"
import { getLunchShifts } from "@/utils/sharedFunctions"

type Props = {
  dataContent: User[] | Organisation[] | null;
}

type accountData = {
  name: string;
  liuId: string;
  nrOfShifts: number;
}

export default async function DataTable(props: Readonly<Props>) {

  const { dataContent } = props;
  if (!dataContent) {
    return <div />
  }

  const assignData = async (dataContent: User[] | Organisation[]): Promise<accountData[]> => {
    // Get the shifts for the user
    const pb = await loadPocketBase();
    if (!pb) {
      console.error("Failed to load PocketBase");
      return [];
    }

    pb.autoCancellation(false);
    if (isUserData) {
      const userData = await Promise.all((dataContent as User[]).map(async (user) => {
        const shifts = await getUsersShifts(pb, user);
        const privateShifts = shifts?.filter(shift => shift.organisation === '') || [];  // Only get private shifts

        return {
          name: user.name,
          liuId: user.username,
          nrOfShifts: privateShifts.length - getLunchShifts(privateShifts),
        };
      }));
      pb?.autoCancellation(true);
      return userData;
    } else {
      return (dataContent as Organisation[]).map((organisation) => ({
        name: organisation.name,
        liuId: "",
        nrOfShifts: organisation.nrOfShifts,
      }));
    }
  }

  const isUserData = (dataContent as User[])[0]?.username !== undefined;
  const tableData = await assignData(dataContent);

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className={`font-medium ${isUserData && 'sm:table-cell hidden'}`}>Namn</TableHead>
          {isUserData && <TableHead>LiuId</TableHead>}
          <TableHead className="text-right">Jobbade pass{isUserData && " (privat)"}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {tableData && tableData.length === 0 && (
          <TableRow>
            <TableCell colSpan={isUserData ? 3 : 2} className="bg-gray-50 font-medium">Inga resultat</TableCell>
          </TableRow>
        )}
        {tableData.map((data, index) => (
          <TableRow key={data.name} className={index % 2 === 0 ? "bg-gray-50" : ""}>
            <TableCell className={`font-medium ${isUserData && 'sm:block hidden'}`}>{data.name}</TableCell>
            {isUserData && <TableCell>{data.liuId}</TableCell>}
            <TableCell className="text-right">{data.nrOfShifts}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

