'use server'

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { loadPocketBase, getUser, getUserOrganisations } from "@/lib/pocketbase";
import { getUsersShifts } from "@/lib/scheduling";
import DataTable from "./dataTable";
import LogOutCard from "./logOutCard";
// import { Shift } from "@/lib/types";


async function ProfilePage() {
  const getShiftMessage = (nrOfShifts: number) => {
    if (nrOfShifts === 0) {
      return "Du har inte jobbat några pass än :(";
    } else if (nrOfShifts === 1) {
      return "Du har jobbat ett pass, keep going!";
    } else if (nrOfShifts === 2) {
      return "Två pass ändå, det går framåt!";
    }
    else if (nrOfShifts >= 3 && nrOfShifts <= 5) {
      return `${nrOfShifts} pass är ju toppen, bra jobbat!`;
    }
    else {
      return `${nrOfShifts} pass?? Du är en riktig hjälte!`;
    }
  }

  const pb = await loadPocketBase();
  const user = await getUser();
  if (!user || !pb) {
    return <div>Loading...</div>;
  }
  // const userAvatar: string = await getAvatar(user.id, user.avatar) ?? '';
  const allUsersShifts = await getUsersShifts(pb, user);
  const userShifts: { name: string, nrOfShifts: number }[] = [];
  const userOrganisations = await getUserOrganisations();
  console.log(allUsersShifts);

  // Add private shifts to userShifts
  userShifts.push({
    name: "privat",
    nrOfShifts: allUsersShifts.filter(shift => shift.organisation === "").length,
  });

  // Add organisation shifts to userShifts
  userOrganisations.forEach(org => {
    userShifts.push({
      name: org.name,
      nrOfShifts: allUsersShifts.filter(shift => shift.organisation === org.name).length,
    });
  });


  return (
    <main className="flex flex-col gap-y-4 w-full min-h-[82vh]" style={{ padding: '20px' }}>
      <Card className="sm:w-[600px]">
        <CardHeader>
          <CardTitle className="text-4xl tabular-nums">
            {user.name}
          </CardTitle>
        </CardHeader>
      </Card>
      <Card className="sm:w-[600px]">
        <CardHeader>
          <CardTitle>Du har jobbat</CardTitle>
          <CardDescription>
            {userShifts.map((organisation) => (
              <span key={organisation.name} className="flex items-end">
                <span className="text-3xl font-semibold text-black mr-1">{organisation.nrOfShifts} </span>
                pass {organisation.name !== 'privat' && "för "}
                <span className="font-semibold text-black ml-1">{organisation.name}</span>
              </span>
            ))}
          </CardDescription>
          <CardDescription>
            {getShiftMessage(allUsersShifts?.length)}
          </CardDescription>
        </CardHeader>
      </Card>
      <Card className="sm:w-[700px]">
        <CardHeader>
          <CardTitle>
            Dina föreningar
          </CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable dataContent={userOrganisations} />
        </CardContent>
      </Card>
      <LogOutCard />
    </main>
  );
};

export default ProfilePage;