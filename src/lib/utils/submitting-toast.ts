import type { Readable } from 'svelte/store';
import { toast } from 'svelte-sonner';
import { m } from '$lib/paraglide/messages';
import { DELAY_MS } from '$lib/consts/forms';

export type SubmittingToastOptions = {
  message?: string;        // texto do toast
};

function generateId() {
	const id = crypto.randomUUID();
	return id;
}

/** 
 * Cria controlador que mostra um toast.loading enquanto o store `submitting` for true.
 * - Retorna um controller com dispose() para limpar subs/timeout e dismiss do toast.
 */
export function createSubmittingToast(
  submitting: Readable<boolean>,
  opts: SubmittingToastOptions = {}
) {
  const { message = m['toast.default.loading'] } = opts;
  const id = generateId();

  let toastId: string | number | null = null;
  let timer: ReturnType<typeof setTimeout> | null = null;
  let isSubmitting = false;

  const unsubscribe = submitting.subscribe((v) => {
    isSubmitting = !!v;

    if (isSubmitting) {
      // debounce: só cria o toast se continuar submetendo após `delay`
      if (!timer) {
        timer = setTimeout(() => {
          // se ainda estiver submetendo e não houver toast, mostra
          if (isSubmitting && !toastId) {
            // toast.loading costuma retornar um id; guardamos para dismiss posterior
            toastId = id ?? toast.loading(message);
            // se o toast.loading do seu pacote NÃO retornar id, use:
            // toast.loading(message); toastId = id ?? 'generated-' + crypto.randomUUID();
          }
          timer = null;
        }, DELAY_MS);
      }
    } else {
      // parou de submeter -> cancela timer e fecha toast se existir
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
      if (toastId) {
        toast.dismiss(toastId);
        toastId = null;
      }
    }
  });

  // retorno: dispose() para cleanup no componente
  function dispose() {
    unsubscribe();
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
    if (toastId) {
      toast.dismiss(toastId);
      toastId = null;
    }
  }

  return { dispose };
}
