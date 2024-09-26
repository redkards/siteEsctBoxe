<?php

namespace App\Controller;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\String\Slugger\SluggerInterface;
use Symfony\Component\HttpFoundation\File\Exception\FileException;

class FileUploadController extends AbstractController
{
    // #[Route('/api/upload', name: 'file_upload', methods: ['POST'])]
    // public function upload(Request $request, SluggerInterface $slugger): JsonResponse
    // {
    //     // Récupérer le fichier depuis la requête
    //     $file = $request->files->get('file');

    //     // Vérifier si un fichier a bien été envoyé
    //     if (!$file) {
    //         return new JsonResponse(['error' => 'No file uploaded'], Response::HTTP_BAD_REQUEST);
    //     }

    //     // Générer un nom unique pour le fichier
    //     $originalFilename = pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME);
    //     $safeFilename = $slugger->slug($originalFilename);
    //     $newFilename = $safeFilename . '-' . uniqid() . '.' . $file->guessExtension();

    //     try {
    //         // Vérifiez si le répertoire d'uploads est défini dans les paramètres de Symfony
    //         $uploadDirectory = $this->getParameter('uploads_directory');

    //         if (!$uploadDirectory) {
    //             return new JsonResponse(['error' => 'Upload directory not configured'], Response::HTTP_INTERNAL_SERVER_ERROR);
    //         }

    //         // Déplacez le fichier dans le répertoire défini
    //         $file->move($uploadDirectory, $newFilename);
    //     } catch (FileException $e) {
    //         // Retourner une erreur si le déplacement échoue
    //         return new JsonResponse(['error' => 'File upload error: ' . $e->getMessage()], Response::HTTP_INTERNAL_SERVER_ERROR);
    //     }

    //     // Retourner une réponse de succès
    //     return new JsonResponse(['message' => 'File uploaded successfully', 'filename' => $newFilename], Response::HTTP_OK);
    // }


    private $slugger;

    // Injection du SluggerInterface via le constructeur
    public function __construct(SluggerInterface $slugger)
    {
        $this->slugger = $slugger;
    }

    #[Route('/api/upload', name: 'file_upload', methods: ['POST'])]
    public function upload(Request $request): JsonResponse
    {
        // Récupérer le fichier depuis la requête
        /** @var UploadedFile $file */
        $file = $request->files->get('file');

        if (!$file) {
            return new JsonResponse(['error' => 'No file uploaded'], Response::HTTP_BAD_REQUEST);
        }

        // Vérifier si le fichier est bien une image (MIME types)
        $mimeType = $file->getMimeType();
        $allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

        if (!in_array($mimeType, $allowedMimeTypes)) {
            return new JsonResponse(['error' => 'Invalid file type. Only image files are allowed.'], Response::HTTP_BAD_REQUEST);
        }

        // Générer un nom unique pour le fichier
        $originalFilename = pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME);
        $safeFilename = $this->slugger->slug($originalFilename);
        $newFilename = $safeFilename . '-' . uniqid() . '.' . $file->guessExtension();

        try {
            // Utilisation de getParameter pour récupérer le chemin d'upload
            $uploadDirectory = $this->getParameter('uploads_directory');
            $file->move($uploadDirectory, $newFilename);
        } catch (FileException $e) {
            return new JsonResponse(['error' => 'File upload error: ' . $e->getMessage()], Response::HTTP_INTERNAL_SERVER_ERROR);
        }

        return new JsonResponse(['message' => 'File uploaded successfully', 'filename' => $newFilename], Response::HTTP_OK);
    }

     /**
     * @Route("/api/check-file-exists/{fileName}", name="check_file_exists", methods={"GET"})
     */
    public function checkFileExists(string $fileName): JsonResponse
    {
        // Chemin du répertoire où les fichiers sont stockés
        $filePath = $this->getParameter('upload_directory') . '/' . $fileName;

        // Vérifiez si le fichier existe déjà
        $fileExists = file_exists($filePath);

        return new JsonResponse($fileExists);
    }
}

