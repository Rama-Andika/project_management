<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\ProjectDetailResource;
use App\Http\Resources\ProjectResource;
use App\Models\Project;
use App\Models\ProjectDetail;
use App\Models\ProjectName;
use App\Models\ProjectStatus;
use Haruncpi\LaravelIdGenerator\IdGenerator;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Storage;




class ProjectController extends Controller
{
    public $counter;

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $project = Project::with('projectDetails.projectStatus.projectName')->when(request()->q, function ($project) {
            $project = $project->where('name', 'like', '%' . request()->q . '%');
        })->orderBy('number')->paginate(10);

        //ProjectDetail::whereRaw('project_id = "17" AND project_name_id = 1 AND document_attch = "z6tXLCGLz8MbYruujSKmabhEAniln2N4MOFJlyJ6.pdf"')->value('document_attch');

        //return with Api Resource
        return new ProjectResource(true, 'List Data Project Detail', $project);
    }

    public function numberList()
    {
        $project = Project::with('projectDetails.projectStatus.projectName')->when(request()->q, function ($project) {
            $project = $project->where('name', 'like', '%' . request()->q . '%');
        })->orderBy('number')->get();

        //ProjectDetail::whereRaw('project_id = "107" AND project_name_id = 7')->value('id');

        //return with Api Resource
        return new ProjectResource(true, 'List Data Project Detail', $project);
    }

    public function searchBy($status, $number, $startDate, $endDate)
    {
        if ($status != -1) {
            $projects = Project::with('projectDetails.projectStatus.projectName')
                ->whereRaw('number LIKE "%' . $number . '%" AND DATE_FORMAT(projects.created_at, "%Y-%m-%d") BETWEEN "' . $startDate . '" AND "' . $endDate . '" AND status = ' . $status)
                ->orderBy('number')
                ->paginate(5);
        } else {
            $projects = Project::with('projectDetails.projectStatus.projectName')
                ->whereRaw('number LIKE "%' . $number . '%" AND DATE_FORMAT(projects.created_at, "%Y-%m-%d") BETWEEN "' . $startDate . '" AND "' . $endDate . '"')
                ->orderBy('number')
                ->paginate(5);
        }
        //return with Api Resource
        return new ProjectResource(true, 'List Data Project Detail', $projects);
    }

    public function searchByName($name)
    {
        $projects = Project::with('projectDetails.projectName')
            ->whereRaw('project_name = "' . $name . '"')
            ->first();
        //return with Api Resource
        return new ProjectResource(true, 'List Data Project Detail', $projects);
    }



    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $project = Project::find($request->project_id);
        $last_sequence = ProjectDetail::orderBy('id', 'desc')->first()->sequence ?? 0;
        $sequence = str_pad($last_sequence + 1, $last_sequence);




        if ($project != null) {
            $selected_projectDetail_id = ProjectDetail::whereRaw('project_id = "' . $project->id . '" AND project_name_id = "' . $request->project_name_id . '"')->value('id');
            if ($selected_projectDetail_id != null) {
                $update_sequence = ProjectDetail::whereId($selected_projectDetail_id)->first()->sequence;
                $validator = Validator::make($request->all(), [

                    'project_name'     => 'required|unique:projects,project_name,' . $project->id,
                    'status'     => 'required|integer',
                    'note' => 'required',
                    'project_name_id'   => 'required',
                    'project_status_id'   => 'required',
                    'project_note'   => 'required',
                ]);

                if ($validator->fails()) {

                    return response()->json($validator->errors(), 422);
                }

                $project->update([
                    'project_name' => $request->project_name,
                    'status' => $request->status,
                    'note' => $request->note
                ]);

                if ($request->file('document_attch')) {
                    $selected_document = ProjectDetail::whereRaw('project_id = "' . $project->id . '" AND project_name_id = "' . $request->project_name_id . '"')->value('document_attch');
                    Storage::disk('local')->delete('public/document' . basename($selected_document));


                    $filenameWithExt = $request->file('document_attch')->getClientOriginalName();


                    $document_attch = $request->file('document_attch');
                    $document_attch->storeAs('public/document', $filenameWithExt);

                    // $document_attch->storeAs('public/document', $document_attch->hashName());

                    $projectDetail = ProjectDetail::whereId($selected_projectDetail_id)
                        ->update([
                            'project_id'   => $project->id,
                            'project_name_id'   => $request->project_name_id,
                            'sequence'   => $update_sequence,
                            'project_status_id'   => $request->project_status_id,
                            'document_attch'   => $filenameWithExt,
                            'project_note'   => $request->project_note,
                        ]);

                    $maxSequence = ProjectStatus::where('project_name_id', '=', $request->project_name_id)->max('sequence');
                    $currentSequence = ProjectStatus::whereId($request->project_status_id)->value('sequence');

                    if ($currentSequence < $maxSequence) {
                        ProjectDetail::whereRaw('project_id = ' . $project->id . ' AND sequence > ' . $update_sequence)->delete();
                    }
                } else {
                    $projectDetail = ProjectDetail::where('id', '=', $selected_projectDetail_id)
                        ->update([
                            'project_id'   => $project->id,
                            'project_name_id'   => $request->project_name_id,
                            'sequence'   => $update_sequence,
                            'project_status_id'   => $request->project_status_id,
                            'project_note'   => $request->project_note,
                        ]);

                    $maxSequence = ProjectStatus::where('project_name_id', '=', $request->project_name_id)->max('sequence');
                    $currentSequence = ProjectStatus::whereId($request->project_status_id)->value('sequence');

                    if ($currentSequence < $maxSequence) {
                        ProjectDetail::whereRaw('project_id = ' . $project->id . ' AND sequence > ' . $update_sequence)->delete();
                    }
                }

                if ($projectDetail) {
                    if ($project) {
                        return new ProjectResource(true, 'Data Project Berhasil Disimpan!', $project);
                    } else {
                        return new ProjectResource(false, 'Data Project gagal Disimpan!', null);
                    }
                } else {
                    return new ProjectDetailResource(true, 'Data Project Detail gagal Disimpan!', null);
                }
            } else {
                $validator = Validator::make($request->all(), [

                    'project_name'     => 'required',
                    'status'     => 'required|integer',
                    'note' => 'required',
                    'project_name_id'   => 'required',
                    'project_status_id'   => 'required',
                    'document_attch'   => '',
                    'project_note'   => 'required',
                ]);

                if ($validator->fails()) {

                    return response()->json($validator->errors(), 422);
                }



                if ($request->hasFile('document_attch')) {

                    $filenameWithExt = $request->file('document_attch')->getClientOriginalName();


                    $document_attch = $request->file('document_attch');
                    $document_attch->storeAs('public/document', $filenameWithExt);

                    $projectDetail = ProjectDetail::create([

                        'project_id'   => $project->id,
                        'project_name_id'   => $request->project_name_id,
                        'sequence'   => $sequence,
                        'project_status_id'   => $request->project_status_id,
                        'document_attch'   => $filenameWithExt,
                        'project_note'   => $request->project_note,

                    ]);
                } else {
                    $projectDetail = ProjectDetail::create([

                        'project_id'   => $project->id,
                        'project_name_id'   => $request->project_name_id,
                        'sequence'   => $sequence,
                        'project_status_id'   => $request->project_status_id,
                        'document_attch'   => "-",
                        'project_note'   => $request->project_note,

                    ]);
                }

                if ($projectDetail) {
                    if ($project) {
                        return new ProjectResource(true, 'Data Project Berhasil Disimpan!', $project);
                    } else {
                        return new ProjectResource(false, 'Data Project gagal Disimpan!', null);
                    }
                } else {
                    return new ProjectDetailResource(true, 'Data Project Detail gagal Disimpan!', null);
                }
            }
        } else {
            $validator = Validator::make($request->all(), [

                'project_name'     => 'required|unique:projects',
                'status'     => 'required|integer',
                'note' => 'required',
                'project_name_id'   => 'required',
                'project_status_id'   => 'required',
                'document_attch'   => '',
                'project_note'   => 'required',
            ]);



            if ($validator->fails()) {

                return response()->json($validator->errors(), 422);
            }

            $last_sequence = ProjectDetail::orderBy('id', 'desc')->first()->sequence ?? 0;
            $number = IdGenerator::generate(['table' => 'projects', 'field' => 'number', 'length' => 14, 'prefix' => 'PRJ-' . date("ym") . "-"]);
            $projectName = ProjectName::pluck('id');
            $sequence = str_pad($last_sequence + 1, $last_sequence);

            //create project
            $project = Project::create([

                'number' => $number,

                'project_name' => $request->project_name,

                'status' => $request->status,

                'note' => $request->note,

                'prefix_number' => 'PRJ/' . date("ym"),

            ]);


            $project_id = $project->id;
            if ($request->hasFile('document_attch')) {
                $filenameWithExt = $request->file('document_attch')->getClientOriginalName();


                $document_attch = $request->file('document_attch');
                $document_attch->storeAs('public/document', $filenameWithExt);

                $projectDetail = ProjectDetail::create([

                    'project_id'   => $project_id,
                    'project_name_id'   => $request->project_name_id,
                    'sequence'   => $sequence,
                    'project_status_id'   => $request->project_status_id,
                    'document_attch'   => $filenameWithExt,
                    'project_note'   => $request->project_note,

                ]);
            } else {
                $projectDetail = ProjectDetail::create([

                    'project_id'   => $project_id,
                    'project_name_id'   => $request->project_name_id,
                    'sequence'   => $sequence,
                    'project_status_id'   => $request->project_status_id,
                    'document_attch'   => "-",
                    'project_note'   => $request->project_note,

                ]);
            }

            // foreach ($projectName as $value) {
            //     $sequence++;
            //     if ($value == $request->project_name_id) {

            //         if ($request->hasFile('document_attch')) {
            //             $filenameWithExt = $request->file('document_attch')->getClientOriginalName();
            //             $filename = pathinfo($filenameWithExt, PATHINFO_FILENAME);
            //             $extension = $request->file('document_attch')->getClientOriginalExtension();
            //             $filenameSimpan = $filename . '_' . time() . '.' . $extension;

            //             $document_attch = $request->file('document_attch');
            //             $document_attch->storeAs('public/document', $filenameSimpan);

            //             $projectDetail = ProjectDetail::create([

            //                 'project_id'   => $project_id,
            //                 'project_name_id'   => $request->project_name_id,
            //                 'sequence'   => $sequence,
            //                 'project_status'   => $request->project_status,
            //                 'document_attch'   => $filenameSimpan,
            //                 'project_note'   => $request->note,

            //             ]);
            //         } else {
            //             $projectDetail = ProjectDetail::create([

            //                 'project_id'   => $project_id,
            //                 'project_name_id'   => $request->project_name_id,
            //                 'sequence'   => $sequence,
            //                 'project_status'   => $request->project_status,
            //                 'document_attch'   => "-",
            //                 'project_note'   => $request->note,

            //             ]);
            //         }
            //     } else {
            //         if ($request->hasFile('document_attch')) {
            //             $filenameWithExt = $request->file('document_attch')->getClientOriginalName();
            //             $filename = pathinfo($filenameWithExt, PATHINFO_FILENAME);
            //             $extension = $request->file('document_attch')->getClientOriginalExtension();
            //             $filenameSimpan = $filename . '_' . time() . '.' . $extension;

            //             $document_attch = $request->file('document_attch');
            //             $document_attch->storeAs('public/document', $filenameSimpan);

            //             $projectDetail = ProjectDetail::create([

            //                 'project_id'   => $project_id,
            //                 'project_name_id'   => $value,
            //                 'sequence'   => $sequence,
            //                 'project_status'   => "-",
            //                 'document_attch'   => "-",
            //                 'project_note'   => "-",

            //             ]);
            //         } else {
            //             $projectDetail = ProjectDetail::create([

            //                 'project_id'   => $project_id,
            //                 'project_name_id'   => $value,
            //                 'sequence'   => $sequence,
            //                 'project_status'   => "-",
            //                 'document_attch'   => "-",
            //                 'project_note'   => "-",

            //             ]);
            //         }
            //     }
            // }

            if ($projectDetail) {
                if ($project) {
                    return new ProjectResource(true, 'Data Project Berhasil Disimpan!', $project);
                } else {
                    return new ProjectResource(false, 'Data Project gagal Disimpan!', null);
                }
            } else {
                return new ProjectDetailResource(true, 'Data Project Detail gagal Disimpan!', null);
            }
        }
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {

        $project = Project::with('projectDetails.projectStatus.projectName')->whereId($id)->first();

        if ($project) {
            return new ProjectResource(true, 'Detail data Project ', $project);
        }

        return new ProjectResource(true, 'Detail data Project tidak ditemukan', null);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */



    public function update(Request $request, Project $project)
    {
        $validator = Validator::make($request->all(), [
            'project_name'     => 'required|unique:projects,project_name,' . $project->id,
            'status'     => 'required|integer',
            'note'     => 'required',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $number = Project::whereId($project->id)->first()->number;
        //update project withour image
        $project->update([
            'number' => $number,

            'project_name' => $request->project_name,

            'status' => $request->status,

            'note' => $request->note,

            'prefix_number' => 'PRJ/' . date("ym"),

        ]);

        if ($project) {
            return new ProjectResource(true, 'Data project berhasil di update', $project); # code...
        }

        return new ProjectResource(false, 'Data project gagal di update', null);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy(Project $project)
    {
        $projectDetail = ProjectDetail::where('project_id', '=', $project->id)->delete();

        if ($projectDetail) {
            if ($project->delete()) {
                return new ProjectResource(true, 'Data project berhasil di hapus', null);
            }
            // $current_number = Project::whereId($project->id)->first()->number;
            // $min_number = Project::orderBy($project->id)->first()->number;
            // if($current_number > $min_number){

            // }

        }

        return new ProjectResource(false, 'Data project gagal di hapus', null);
    }

    public function deleteProjectDetail($project_id, $projectNameId)
    {
        $projectDetail = ProjectDetail::whereRaw('project_id = ' . $project_id . ' AND project_name_id = ' . $projectNameId)->delete();

        if ($projectDetail) {

            return new ProjectDetailResource(true, 'Data project detail berhasil di hapus', null);

            // $current_number = Project::whereId($project->id)->first()->number;
            // $min_number = Project::orderBy($project->id)->first()->number;
            // if($current_number > $min_number){

            // }

        }

        return new ProjectResource(false, 'Data project gagal di hapus', null);
    }

    public function downloadFile($file)
    {
        // $project = Project::find($request->project_id);

        // if ($project != null) {
        //     $selected_projectDetail_id = ProjectDetail::whereRaw('project_id = "' . $project->id . '" AND project_name_id = "' . $request->project_name_id . '" AND document_attch = "' . $request->document_attch)->value('document_attch');
        //     if ($selected_projectDetail_id != null) {
        //         $myFile = storage_path('document/' . $selected_projectDetail_id);
        //         return response()->download($myFile);
        //     }
        // }

        return response()->download(storage_path('/app/public/document/'. $file));
    }
}
