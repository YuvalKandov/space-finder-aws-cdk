import { useState, useEffect } from "react";
import SpaceComponent from "./SpaceComponent";
import { NavLink } from "react-router-dom";
import { DataService } from "../../services/DataService";
import type { SpaceEntry } from "../model/model";

interface SpacesProps {
    dataService: DataService
}

export default function Spaces(props: SpacesProps) {

    const [spaces, setSpaces] = useState<SpaceEntry[]>([]);
    const [reservationText, setReservationText] = useState<string>();
  
    useEffect(() => {
      const getSpaces = async () => {
        console.log("getting spaces....");
        try {
          const result = await props.dataService.getSpaces();
          setSpaces(Array.isArray(result) ? result : (result ?? []));
        } catch (e) {
          console.error("Failed to fetch spaces:", e);
          setSpaces([]);
        }
      };
      getSpaces();
    }, []);
  
    async function reserveSpace(spaceId: string, spaceName: string) {
      const reservationResult = await props.dataService.reserveSpace(spaceId);
      setReservationText(`You reserved ${spaceName}, reservation id: ${reservationResult}`);
    }
  
    function renderSpaces() {
      if (!props.dataService.isAuthorized()) {
        return <NavLink to={"/login"}>Please login</NavLink>;
      }
  
      return spaces.map(spaceEntry => (
        <SpaceComponent
          key={spaceEntry.id}
          id={spaceEntry.id}
          location={spaceEntry.location}
          name={spaceEntry.name}
          photoUrl={spaceEntry.photoUrl}
          reserveSpace={reserveSpace}
        />
      ));
    }
  
    return (
      <div>
        <h2>Welcome to the Spaces page!</h2>
        {reservationText ? <h2>{reservationText}</h2> : undefined}
        {renderSpaces()}
      </div>
    );
  }