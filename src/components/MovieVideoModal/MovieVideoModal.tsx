import './MovieVideoModal.css';

export default function MovieVideoModal({ moviekey, modalRef, title }: { moviekey?: string; modalRef: string | null; title?: string; }) {
  return (
    <div data-testid="movievideo-modal-container" className='movievideo-modal-container'>
      <iframe
        data-testid="movievideo-modal-video"
        ref={modalRef}
        title={title}
        src={`https://www.youtube.com/embed/${moviekey}`} />
    </div>
  );
}
