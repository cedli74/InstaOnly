"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Switch } from "@/components/ui/switch"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import {
  PlusCircle,
  Edit,
  Trash2,
  History,
  BarChart3,
  Instagram,
  Users,
  MessageCircle,
  Heart,
  Wifi,
  WifiOff,
  CheckCircle,
  AlertCircle,
  Save,
  X,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function AccountDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const accountId = params.id

  // État pour le statut de connexion
  const [isConnected, setIsConnected] = useState(accountId !== "3")
  const [showAlert, setShowAlert] = useState(false)
  const [alertMessage, setAlertMessage] = useState("")
  const [alertType, setAlertType] = useState<"success" | "error">("success")
  
  // États pour la modification du compte
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editForm, setEditForm] = useState({
    username: "",
    bio: "",
    avatar: ""
  })

  // Vérifier les paramètres d'URL pour les messages OAuth
  useEffect(() => {
    const success = searchParams.get('success')
    const error = searchParams.get('error')
    
    if (success) {
      setAlertMessage("Connexion Instagram réussie !")
      setAlertType("success")
      setShowAlert(true)
      setIsConnected(true)
    } else if (error) {
      setAlertMessage(`Erreur de connexion: ${error}`)
      setAlertType("error")
      setShowAlert(true)
    }
  }, [searchParams])

  // Données simulées du compte
  const [account, setAccount] = useState({
    id: accountId,
    username: accountId === "1" ? "mode_paris" : accountId === "2" ? "design_studio" : "travel_photos",
    followers: accountId === "1" ? "15.2K" : accountId === "2" ? "8.7K" : "23.5K",
    following: accountId === "1" ? "420" : accountId === "2" ? "350" : "512",
    posts: accountId === "1" ? 342 : accountId === "2" ? 187 : 456,
    avatar: "/placeholder.svg?height=100&width=100",
    bio:
      accountId === "1"
        ? "Mode et tendances à Paris | Fashion trends in Paris"
        : accountId === "2"
          ? "Studio de design créatif | Creative design studio"
          : "Photographie de voyage | Travel photography",
  })

  // Initialiser le formulaire de modification quand le dialog s'ouvre
  useEffect(() => {
    if (isEditDialogOpen) {
      setEditForm({
        username: account.username,
        bio: account.bio,
        avatar: account.avatar
      })
    }
  }, [isEditDialogOpen, account])

  // Données simulées des photos pour ce compte
  const photos = [
    {
      id: "1",
      image: "/placeholder.svg?height=400&width=400",
      description: "Notre nouvelle collection printemps #mode #fashion",
      likes: 245,
      comments: 32,
      date: "2024-04-15",
      isStory: false,
    },
    {
      id: "2",
      image: "/placeholder.svg?height=400&width=400",
      description: "Détails de notre dernière création #design #fashion",
      likes: 189,
      comments: 17,
      date: "2024-04-10",
      isStory: false,
    },
    {
      id: "3",
      image: "/placeholder.svg?height=400&width=400",
      description: "Inspiration du jour #style #mode",
      likes: 320,
      comments: 45,
      date: "2024-04-05",
      isStory: false,
    },
    {
      id: "4",
      image: "/placeholder.svg?height=400&width=400",
      description: "Nouvelle collection été #summer #fashion",
      likes: 278,
      comments: 23,
      date: "2024-04-18",
      isStory: true,
    },
    {
      id: "5",
      image: "/placeholder.svg?height=400&width=400",
      description: "Coulisses du shooting #behindthescenes",
      likes: 156,
      comments: 12,
      date: "2024-04-20",
      isStory: true,
    },
  ]

  const regularPhotos = photos.filter((photo) => !photo.isStory)
  const storyPhotos = photos.filter((photo) => photo.isStory)

  // Statistiques simulées
  const stats = [
    { label: "Vues", value: "4.2K", change: "+12%", icon: <Users className="h-4 w-4" /> },
    { label: "Engagement", value: "8.7%", change: "+3%", icon: <Heart className="h-4 w-4" /> },
    { label: "Commentaires", value: "342", change: "+5%", icon: <MessageCircle className="h-4 w-4" /> },
    { label: "Portée", value: "12.5K", change: "+8%", icon: <BarChart3 className="h-4 w-4" /> },
  ]

  // Fonction pour changer le statut de connexion
  const toggleConnectionStatus = () => {
    setIsConnected(!isConnected)
  }

  const handleInstagramConnect = () => {
    // Rediriger vers l'endpoint OAuth du backend
    window.location.href = 'http://localhost:5000/auth/instagram'
  }

  // Fonction pour ouvrir le dialog de modification
  const handleEditAccount = () => {
    if (!isConnected) {
      setAlertMessage("Vous devez être connecté pour modifier le compte")
      setAlertType("error")
      setShowAlert(true)
      return
    }
    setIsEditDialogOpen(true)
  }

  // Fonction pour sauvegarder les modifications
  const handleSaveAccount = async () => {
    try {
      // Simuler un appel API (remplacer par votre vraie API)
      // const response = await fetch(`/accounts/${accountId}`, {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(editForm)
      // })

      // Pour la démo, on met à jour directement l'état
      setAccount(prev => ({
        ...prev,
        username: editForm.username,
        bio: editForm.bio,
        avatar: editForm.avatar
      }))

      setIsEditDialogOpen(false)
      setAlertMessage("Compte modifié avec succès !")
      setAlertType("success")
      setShowAlert(true)
    } catch (error) {
      setAlertMessage("Erreur lors de la modification du compte")
      setAlertType("error")
      setShowAlert(true)
    }
  }

  // Fonction pour gérer les changements du formulaire
  const handleFormChange = (field: string, value: string) => {
    setEditForm(prev => ({
      ...prev,
      [field]: value
    }))
  }

  return (
    <div className="container p-4 md:p-8 space-y-8">
      {showAlert && (
        <Alert className={alertType === "success" ? "border-green-500" : "border-red-500"}>
          {alertType === "success" ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
          <AlertDescription>{alertMessage}</AlertDescription>
        </Alert>
      )}

      <div className="flex items-center justify-between">
        <Button variant="outline" size="sm" onClick={() => router.push("/dashboard/accounts")}>
          Retour aux comptes
        </Button>
        <div className="flex gap-2">
          <Link href={`/dashboard/photos/add?account=${account.username}`}>
            <Button disabled={!isConnected}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Ajouter une photo
            </Button>
          </Link>
          
          {/* Dialog pour modifier le compte */}
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" onClick={handleEditAccount}>
                <Edit className="mr-2 h-4 w-4" />
                Modifier le compte
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Modifier le compte @{account.username}</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="username" className="text-right">
                    Nom d'utilisateur
                  </Label>
                  <Input
                    id="username"
                    value={editForm.username}
                    onChange={(e) => handleFormChange('username', e.target.value)}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="bio" className="text-right">
                    Biographie
                  </Label>
                  <Textarea
                    id="bio"
                    value={editForm.bio}
                    onChange={(e) => handleFormChange('bio', e.target.value)}
                    className="col-span-3"
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="avatar" className="text-right">
                    Avatar URL
                  </Label>
                  <Input
                    id="avatar"
                    value={editForm.avatar}
                    onChange={(e) => handleFormChange('avatar', e.target.value)}
                    className="col-span-3"
                    placeholder="https://..."
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  <X className="mr-2 h-4 w-4" />
                  Annuler
                </Button>
                <Button onClick={handleSaveAccount}>
                  <Save className="mr-2 h-4 w-4" />
                  Sauvegarder
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
            <Avatar className="w-24 h-24 border-2">
              <AvatarImage src={account.avatar || "/placeholder.svg"} alt={account.username} />
              <AvatarFallback>{account.username.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <CardTitle className="text-2xl">@{account.username}</CardTitle>
                <Instagram className="h-5 w-5 text-pink-500" />
                {isConnected ? (
                  <span className="inline-flex items-center text-green-500 text-xs bg-green-100 px-2 py-1 rounded-full">
                    <Wifi className="h-3 w-3 mr-1" /> Connecté
                  </span>
                ) : (
                  <span className="inline-flex items-center text-red-500 text-xs bg-red-100 px-2 py-1 rounded-full">
                    <WifiOff className="h-3 w-3 mr-1" /> Déconnecté
                  </span>
                )}
              </div>
              <p className="text-muted-foreground">{account.bio}</p>
              <div className="flex gap-6 text-sm">
                <div>
                  <span className="font-bold">{account.posts}</span> publications
                </div>
                <div>
                  <span className="font-bold">{account.followers}</span> abonnés
                </div>
                <div>
                  <span className="font-bold">{account.following}</span> abonnements
                </div>
              </div>
              
              {/* Configuration du compte avec bouton OAuth */}
              <div className="flex flex-col space-y-4 pt-4">
                <div className="flex items-center space-x-2">
                  <span className="text-sm">Statut du compte:</span>
                  <Switch id="connection-toggle" checked={isConnected} onCheckedChange={toggleConnectionStatus} />
                  <span className="text-sm font-medium">{isConnected ? "Connecté" : "Déconnecté"}</span>
                </div>
                
                {!isConnected && (
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                      Connectez-vous avec Instagram pour gérer ce compte
                    </p>
                    <Button onClick={handleInstagramConnect} className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                      <Instagram className="mr-2 h-4 w-4" />
                      Se connecter avec Instagram
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid gap-6 md:grid-cols-4">
        {stats.map((stat, index) => (
          <Card key={index} className={!isConnected ? "opacity-50" : ""}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="text-muted-foreground">{stat.label}</div>
                {stat.icon}
              </div>
              <div className="text-2xl font-bold mt-2">{stat.value}</div>
              <div className={`text-xs mt-1 ${stat.change.startsWith("+") ? "text-green-500" : "text-red-500"}`}>
                {stat.change} ce mois
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="photos" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="photos">Publications</TabsTrigger>
          <TabsTrigger value="stories">Stories</TabsTrigger>
        </TabsList>

        <TabsContent value="photos" className="mt-6">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {regularPhotos.map((photo) => (
              <Card key={photo.id} className="overflow-hidden">
                <div className="relative aspect-square">
                  <Image
                    src={photo.image || "/placeholder.svg"}
                    alt={photo.description}
                    fill
                    className="object-cover"
                  />
                </div>
                <CardContent className="p-4">
                  <p className="text-sm text-muted-foreground line-clamp-2">{photo.description}</p>
                  <div className="flex items-center gap-4 mt-2 text-sm">
                    <div className="flex items-center gap-1">
                      <Heart className="h-4 w-4" /> {photo.likes}
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageCircle className="h-4 w-4" /> {photo.comments}
                    </div>
                    <div className="text-muted-foreground ml-auto">{new Date(photo.date).toLocaleDateString()}</div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between p-4 pt-0">
                  <Button variant="outline" size="sm" disabled={!isConnected}>
                    <Edit className="mr-2 h-4 w-4" />
                    Modifier
                  </Button>
                  <Button variant="outline" size="sm" className="text-blue-500" disabled={!isConnected}>
                    <History className="mr-2 h-4 w-4" />
                    Story
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="stories" className="mt-6">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {storyPhotos.map((photo) => (
              <Card key={photo.id} className="overflow-hidden">
                <div className="relative aspect-square">
                  <div className="absolute inset-0 border-4 border-pink-500 rounded-lg z-10"></div>
                  <Image
                    src={photo.image || "/placeholder.svg"}
                    alt={photo.description}
                    fill
                    className="object-cover"
                  />
                </div>
                <CardContent className="p-4">
                  <p className="text-sm text-muted-foreground line-clamp-2">{photo.description}</p>
                  <div className="flex items-center gap-4 mt-2 text-sm">
                    <div className="flex items-center gap-1">
                      <Heart className="h-4 w-4" /> {photo.likes}
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageCircle className="h-4 w-4" /> {photo.comments}
                    </div>
                    <div className="text-muted-foreground ml-auto">{new Date(photo.date).toLocaleDateString()}</div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between p-4 pt-0">
                  <Button variant="outline" size="sm" disabled={!isConnected}>
                    <Edit className="mr-2 h-4 w-4" />
                    Modifier
                  </Button>
                  <Button variant="outline" size="sm" className="text-red-500" disabled={!isConnected}>
                    <Trash2 className="mr-2 h-4 w-4" />
                    Supprimer
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
