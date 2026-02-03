import Button from "../../ui/Button";
import Modal from "../../ui/Modal";
import CreateCabinForm from "./CreateCabinForm";
import CabinTable from "./CabinTable";

function AddCabin() {
  return (
    <div>

    <Modal>
      <Modal.Open opens="cabin-form">
        <Button>Add new cabin</Button>
      </Modal.Open>
      <Modal.Window name="cabin-form">
        <CreateCabinForm />
      </Modal.Window>

    </Modal>
    </div>
  );
}

export default AddCabin;

// function AddCabin() {
//   const [isOpenModel, setIsOpenModal] = useState(false);

//   return (
//     <div>
//       <Button onClick={() => setIsOpenModal(!isOpenModel)}>
//         Add new cabin
//       </Button>
//       {isOpenModel && (
//         <Modal
//           onClose={() => {
//             setIsOpenModal(false);
//           }}
//         >
//           <CreateCabinForm onCloseModel={() => setIsOpenModal(false)} />
//         </Modal>
//       )}
//     </div>
//   );
// }

// export default AddCabin;
