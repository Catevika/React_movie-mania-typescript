import { useRef, useState } from 'react';
import MovieVideoModal from '../MovieVideoModal/MovieVideoModal';
import { TMovieVideo } from '../../types/types';



export default function MovieVideo({ movieVideo }: { movieVideo: TMovieVideo; }) {
  const { name, key } = movieVideo;
  const modalRef = useRef(null);

  const [isOpen, setIsOpen] = useState(false);

  const scrollbarVisible = () => {
    if (typeof window != 'undefined' && window.document)
      document.body.style.overflow = 'hidden';
  };

  const scrollbarHidden = () => {
    document.body.style.overflow = 'auto';
  };

  const toggleModal = () => {
    setIsOpen(!isOpen);
    isOpen ? scrollbarHidden() : scrollbarVisible();
  };

  return (
    <div onClick={e => e.target !== modalRef.current && toggleModal()} data-testid="movie video link">
      {name}
      {isOpen && key && modalRef && name && <MovieVideoModal moviekey={key} modalRef={modalRef.current} title={name} />}</div>
  );
}
